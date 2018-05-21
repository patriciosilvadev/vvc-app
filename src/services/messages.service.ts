import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {AppState} from '../store/reducers/main.reducer';
import {NewMessage,RemoveMessage,UpdateMessage} from '../store/actions/messages.actions';
import {SystemMessage, ChatMessage, RequestMessage} from '../store/models.interface';

@Injectable()
export class VvcMessageService {

  constructor(
    private store: Store<AppState>
  ){}

  addChatMessage(message, agent?, visitorNick?){
    const id = new Date().getTime().toString();
    const msg:ChatMessage = {
      id: id,
      text: message.body,
      type: 'chat',
      isAgent: agent,
      time: this.getChatTimestamp(message.ts)
    };
    if (agent) msg.agent = agent;
    if (message.meta) msg.meta = message.meta;
    if (visitorNick) msg.visitorNick = visitorNick;
    this.store.dispatch(new NewMessage(msg));
    return id;
  }
  addCustomMessage(message){
    const id = new Date().getTime().toString();
    const m = {
      id: id,
      code: "message",
      type: "custom",
      body: { ...message }
    };
    this.store.dispatch(new NewMessage(m));
    return id;
  }
  addLocalMessage(text){
    const id = new Date().getTime().toString();
    const msg: ChatMessage = {
      id: id,
      text:text,
      type: 'chat',
      isAgent: false,
      time: this.getChatTimestamp()
    };
    this.store.dispatch(new NewMessage(msg));
    return id;
  }
  addQuickRepliesMessage(message){
    const id = new Date().getTime().toString();
    const quick = {
      id: id,
      code: "message",
      type: "quick-replies",
      body: message.body,
      quick_replies: message.quick_replies,
      quick_replies_orientation: message.quick_replies_orientation
    };
    this.store.dispatch(new NewMessage(quick));
    return id;
  }
  addTemplateMessage(message){
    const id = new Date().getTime().toString();
    const template = {
      id: id,
      type: 'template',
      template: message.template.type,
      elements: message.template.elements,
      buttons: message.template.buttons
    };
    this.store.dispatch(new NewMessage(template));
    return id;
  }
  getChatTimestamp(tsString?: string){
    let t;
    if (tsString) t = new Date(tsString);
    else t = new Date();
    const h = (parseInt(t.getHours()) > 9) ? t.getHours() : "0"+t.getHours();
    const m = (parseInt(t.getMinutes()) > 9) ? t.getMinutes() : "0"+t.getMinutes();
    return h + ":" + m;
  }
  removeMessage(messageId: string){
    this.store.dispatch(new RemoveMessage(messageId));
  }
  sendRequestMessage(message){
    const id = new Date().getTime().toString();
    let m: RequestMessage = {
      id: id,
      type: 'request',
      text: message.toUpperCase()
    };
    this.store.dispatch(new NewMessage(m));
    return id;
  }
  sendSystemMessage(messageNameId: string, context?: any){
    const id = new Date().getTime().toString();
    let message: SystemMessage = {
      id: id,
      type: 'system',
      text: messageNameId
    };
    if (context){
      message.context = context;
    }
    this.store.dispatch(new NewMessage(message));
    return id;
  }
  updateQuickReply(messageId){
    this.store.dispatch(new UpdateMessage({ id: messageId, patch: { replied : true }}))
  }
}