function SOAPSetMyDLinkSettings(){this.Enabled=true;this.Email="";this.Password="";this.LastName="";this.FirstName="";this.AccountStatus=false}SOAPSetMyDLinkSettings.prototype={get Password(){return this._Password},set Password(a){this._Password=AES_Encrypt128(a)}};function SOAPGetMyDLinkSettingsResponse(){this.Enabled=false;this.Email="";this.Password="";this.LastName="";this.FirstName="";this.AccountStatus=false}SOAPGetMyDLinkSettingsResponse.prototype={get Password(){return AES_Decrypt128(this._Password)},set Password(a){this._Password=a}};function SOAPSetMyDLinkUnregistration(){this.Unregistration=true};