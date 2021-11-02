/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Instagram For Original Coast Clothing
 *
 */

"use strict";

const Response = require("./response"),
  GraphApi = require("./graph-api"),
  i18n = require("../i18n.config");
var FormData = require('form-data');
var axios = require('axios')
module.exports = class Receive {
  constructor(user, webhookEvent, keyv, style) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    this.keyv = keyv;
    this.style = style
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.is_echo) {
          return;
        } else if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (!responses) {
      return;
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
      `Received text from user '${this.user.name}' (${this.user.igsid}):\n`,
      this.webhookEvent.message.text
    );

    let message = this.webhookEvent.message.text.trim().toLowerCase();

    let response;

    if (message.toLowerCase() === "/start") {
      response = [Response.genText('choose art style to be apply :'), Response.genStyleTemplate()]
    } else if (message.toLowerCase() === "/about") {
      response = Response.genText('Photart is chatbot that help you to styling your photo to various art style.\n\nPowered by pytorch.org')
    } else {
      response = {
        text: `type : \n/start to styling photo \n/about for app information`
      };
    }

    return response;
  }

  // Handle mesage events with attachments
  handleAttachmentMessage() {
    let response;
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${JSON.stringify(attachment)} for ${this.user.igsid}`);
    let userId = this.user.igsid;
    let style = this.style;
    console.log('style :' + style)
    if (style != undefined && attachment.type == "image") {
      // upload image to ML
      let IMAGE_URL = attachment.payload.url;
      let UPLOAD_URL = `http://style-transfer-app-url/upload/?style=${style.toLowerCase()}`
      //console.log('upload url :' + UPLOAD_URL)
     

      //Create form data
      const form = new FormData()
      form.append('imageUrl', IMAGE_URL)

      //Submit form
      axios({
        url: UPLOAD_URL,
        method: "POST",
        data: form,
        headers: { "Content-Type": `multipart/form-data; boundary=${form._boundary}` }
      }).then(function(resp) {
        console.log(JSON.stringify(resp.data));
  
        let requestBody = {
          recipient: {
            id: userId
          },
          message: Response.genImage(resp.data)
        };

        let requestBodyText = {
          recipient: {
            id: userId
          },
          message: Response.genText('your photo is ready to download :')
        };

        let requestBodyButton= {
          recipient: {
            id: userId
          },
          message: Response.genPostbackButton('try another one','START')
        };

        GraphApi.callSendApi(requestBodyText).then(()=>{
          GraphApi.callSendApi(requestBody).then(()=>{
            GraphApi.callSendApi(requestBodyButton)
          })

        })

      })
        .catch(function(error) {
          console.log(error);
            let requestBody = {
          recipient: {
            id: userId
          },
          message: Response.genText('there are some error, please try again later')
        };

          GraphApi.callSendApi(requestBody)
        });

      response = Response.genText('Please wait, we are processing your photo ...')


    } else if (style != undefined && attachment.type != "image") {
      response = Response.genText('Please upload an image')
    } else {
      response = {
        text: `type : \n/start to styling photo \n/about for app information`
      };
    }
    return response;
  }

  // Handle mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  // Handle postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;

    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
      console.log('postback :' + payload)
    }
    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log(`Received Payload: ${payload} for user ${this.user.igsid}`);

    let response;

    // Set the response based on the payload
    if (payload === "START") {
       response = [Response.genText('choose art style to be apply :'), Response.genStyleTemplate()]
    } else if (payload === "ABOUT") {
      response = Response.genText('Photart is chatbot that help you to styling your photo to various art style.\n\nPowered by pytorch.org')
    } else if (payload.includes('STYLE_')) {
      let style = payload.replace('STYLE_', '');
      console.log('style' + style)
      let aliasName = this.chooseStyle(style, this.user.igsid);
      response = [Response.genText(`${aliasName} style selected`), Response.genText('Upload your photo here :')]
    }
    else {
      response = {
        text: `type : \n/start to styling photo \n/about for app information`
      };
    }

    return response;
  }


  chooseStyle(style, igsid) {
    this.keyv.set(igsid, style)
    let alias = '';
    switch (style) {
      case "HEISENBERG":
        alias = 'comic'
        break;
      case "RICKANDMORTY":
        alias = 'cartoon'
        break;
      default:
        alias = style.toLowerCase();
    }
    return alias
  }



  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.igsid
      },
      message: response
    };

    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }
};
