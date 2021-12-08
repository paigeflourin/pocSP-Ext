
import AuthUser from "../model/authuser";
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';
import * as Cookies from 'js-cookie';
import * as dayjs from 'dayjs';
import {SiteUsers, Web } from "@pnp/sp/presets/all";
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import pnp, { CachingParserWrapper } from '@pnp/pnpjs';
import User from '../model/user';
import * as CryptoJS from 'crypto-js';

import Rijndael from 'rijndael-js';


export class Authentication {


    // public constructor() {
    //     sp.setup({
    //         spfxContext: this.context
    //       });
    // }
    
    public CreateNewAuth(url, spContext): boolean {
        //check cookie if null then connect to API to authenticate
        console.log("inside auth");


          let myCookie = Cookies.get("userAuthCookie");

          if(myCookie != null) {
            let user = decodeURI(myCookie);
            let userAuthObj: User = JSON.parse(user);
            if(userAuthObj.ExpirationTime <= new Date()){ //if (userAuthObj.ExpirationTime <= DateTime.Now)
              this.AuthenticateUser(url, spContext);
            }

          } else {
            this.AuthenticateUser(url, spContext);
          }
          return false;
      }
    
      public AuthenticateUser(url, spContext): void {
          //connect to api

          let userAuth : AuthUser;


          pnp.sp.web.currentUser.get().then(spUser => {
    
    
            userAuth = {
              Username : "sysadmin",
              RememberMe: "true",
              Submit: "Login",
              //Sudo: spUser.LoginName.substring(spUser.LoginName.indexOf("|") + 2),
              Sudo: spUser.LoginName.split("|")[2],
              // Password: this.DecryptStringFromBytes(this.convertString("5p8oKenDUBO8rOAKrG4HYw=="), this.convertString("ynJcEeOHx4vh/ieA3x5mab4eLknIlIfvdZK/alw0J2s="), this.convertString("P3G5t/+lQ3gHdXt9EVGhVg=="))
              Password: this.convertString("VDRpZzNy")
            };
      
            this.authenticateUser(userAuth, url, "USER", spContext);
          });
         
      }

      public authenticateUser(userAuth: AuthUser, url, permissionLevel, spContext): void {
        let api : string; 
        const body: string = JSON.stringify({
            'j_username': userAuth.Username,
            'j_password': userAuth.Password,
            'remember-me': userAuth.RememberMe,
            'submit': userAuth.Submit,
            'sudo': userAuth.Sudo
          });

          

          const requestHeaders: Headers = new Headers();
          requestHeaders.append('User-Agent', 'SPFX App');
          requestHeaders.append('X-CSRF-TOKEN', null);
          requestHeaders.append('Cookie', null);
          requestHeaders.append('Content-Type', "application/x-www-form-urlencoded");

          if (permissionLevel == "ADMIN"){
            api = "isearch-admin/api/authentication";
          } else{
            api = "isearch-search/api/authentication";
          }


          let baseURL = url + api;


          const httpClientOptions: IHttpClientOptions = {
            body: body,
            headers: requestHeaders
          };

          console.log("About to make REST API request.");

           spContext.httpClient.post(
                baseURL,
                HttpClient.configurations.v1,
                httpClientOptions)
                .then((response: Response) => {
                    console.log("REST API response received.");
                    // Access properties of the response object. 
                    console.log(`Status code: ${response.status}`);
                    console.log(`Status text: ${response.statusText}`);

                    response.json().then((responseJSON: JSON) => {
                        console.log(responseJSON);
                    });
                });


         // userAuthObj = authClass.RunAsync("USER").GetAwaiter().GetResult();
    
          //           if (userAuthObj != null)
          //           {
          //               userAuthObjSerial = JsonConvert.SerializeObject(userAuthObj);
          //               HttpContext.Current.Response.Cookies.Add(new System.Web.HttpCookie("userAuthCookie")
          //               {
          //                   Value = HttpUtility.UrlEncode(userAuthObjSerial),
          //                   Expires = userAuthObj.ExpirationTime
          //               });
          //           }
      }
    
    
    
      public convertString(stringValue) : string {
     
        const data = atob(stringValue);
        
        return data;
        //let arr = Uint8Array.from(data, b => b.charCodeAt(0));
        //return arr;
      }


      public DecryptStringFromBytes(cipherText, key, IV): string {
        let plaintext : string;

        const cipher = new Rijndael(key, 'cbc');



        return plaintext;

      }
}