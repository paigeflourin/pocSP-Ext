import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SearchBarApplicationCustomizerStrings';
import styles from './SearchBarApplicationCustomizer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import {SiteUsers, Web } from "@pnp/sp/presets/all";
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import pnp from '@pnp/pnpjs';
import User from './model/user';
import './searchui-lib/config.js';
import './searchui-lib/search-connector-ui.config.js';
import './searchui-lib/search-ner-ui.config.js';
import './searchui-lib/js/app.js';
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';
import { Authentication } from './helper/Authentication';

const LOG_SOURCE: string = 'SearchBarApplicationCustomizer';


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISearchBarApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  Bottom: string;
  BackendBaseURL: string;
  pw: string;
  username: string;
  rememberMe: boolean;
  sudo: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SearchBarApplicationCustomizer
  extends BaseApplicationCustomizer<ISearchBarApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;
  private _authentication = new Authentication();
  
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    sp.setup({
      spfxContext: this.context
    });

    //let userInfo: User;

      
     pnp.sp.web.currentUser.get().then(spUser => {

        let domsplit = spUser.UserPrincipalName.split('@');
        let username = domsplit[0];
        let domainsplit = domsplit[1];
        let domain = domainsplit.split('.')[0];
        let sudo = domain + "\\" + username;
        // Wait for the placeholders to be created (or handle them being changed) and then
      // render.
      this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

     });   
    
  
    return Promise.resolve<void>(null);
  }


  private _renderPlaceHolders(): void {
    console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );
  
    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
  
      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }
  
      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }
  
        if (this._topPlaceholder.domElement) {
          this._topPlaceholder.domElement.innerHTML = `
          <div class="${styles.app}">
            <div class="${styles.top}">
              
              <h1> header here </h1>
            </div>
              
          </div>`;
        }
      }
    }

    // <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(
    //   topString
    // )}
  
    // Handling the bottom placeholder
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );
  
      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }
  
      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(Bottom property was not defined.)";
        }
  
        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
          <div class="${styles.app}">
            <div class="${styles.bottom}">
              <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(
                bottomString
              )}
            </div>
          </div>`;
        }
      }
    }
  }

  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }



  
}
