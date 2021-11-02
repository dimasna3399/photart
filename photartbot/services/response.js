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

const i18n = require("../i18n.config");

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genImage(url) {
    let response = {
      attachment: {
        type: "image",
        payload: {
          url: url
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }
  static genStyleTemplate() {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: 'Comic Style',
              subtitle: 'Turn your photo to comic art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/heisenberg.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_HEISENBERG"
              }  
              ]
            },
             {
              title: 'Cartoon Style',
              subtitle: 'Turn your photo to cartoon art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/rickandmorty.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_RICKANDMORTY"
              }  
              ]
            },
             {
              title: 'Mosaic Style',
              subtitle: 'Turn your photo to mosaic art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/mosaic.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_MOSAIC"
              }  
              ]
            },
             {
              title: 'Wave Style',
              subtitle: 'Turn your photo to wave art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/wave.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_WAVE"
              }  
              ]
            },
             {
              title: 'PeculiarShop Style',
              subtitle: 'Turn your photo to peculiar shop art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/peculiarshop.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_PECULIARSHOP"
              }  
              ]
            },
             {
              title: 'Opposition Style',
              subtitle: 'Turn your photo to opposition art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/opposition-cropped.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_OPPOSITION-CROPPED"
              }  
              ]
            },
             {
              title: 'Dreams Style',
              subtitle: 'Turn your photo to dreams art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/dreams.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_DREAMS"
              }  
              ]
            },
             {
              title: 'Udnie Style',
              subtitle: 'Turn your photo to udnie art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/udnie.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_UDNIE"
              }  
              ]
            },
             {
              title: 'Rainprincess Style',
              subtitle: 'Turn your photo to rainprincess art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/rainprincess.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_RAINPRINCESS"
              }  
              ]
            },
             {
              title: 'Mud Style',
              subtitle: 'Turn your photo to mud art style',
              image_url: 'https://github.com/puneet29/StyleTransferApp/blob/master/images/style-images/mud.jpg?raw=true',
              buttons: [
                {
                type:"postback",
                title:"Select",
                payload:"STYLE_MUD"
              }  
              ]
            }
          ]
        }
      }
    };

    return response;
  }

};
