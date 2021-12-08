import UserGroup from './usergroup';

export default class User {
    
    public id : number;
    public groups : UserGroup;
    public division : string; 
    public firstName: string; 
    public roles : string[]; 
    public ExpirationTime : Date; 
    public signature : string;
    public designationType : string;
    public Title : string;
   // public odataId : string;
    public userPrincipalName : string;
    //public odataMetadata : string;
    public isSiteAdmin : boolean;
    public loginName : string;
    public Monitored: boolean;
    public Signature: string;
    public CSRFTOKEN: string;
    public RememberMeToken: string;
    public RememberMeAdmin: string;
    public JSESSIONID: string;
    public CSRFTOKENADMIN: string;
 }