import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getUiState} from '../store/selectors/widget.selectors';
import {AppState, getEventsState} from '../store/reducers/main.reducer';
import {VvcContextService} from './context.service';
import {ContextState, Dimension, EventsState, LeftScrollOffset, UiState} from '../store/models.interface';
import {VvcContactWrap} from './contact-wrap.service';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';


@Injectable()
export class VvcInteractionService {

  private vivocha;
  private context: ContextState;

  agentRequestCallback;

  constructor(
    private store: Store<AppState>,
    private contextService: VvcContextService,
    private contactService: VvcContactWrap,
    private translateService: TranslateService
  ) {

  }

  /**** PUBLIC METHOD ****/
  acceptAgentRequest(requestId) {
    this.contactService.acceptAgentRequest(requestId);
  }
  acceptOffer() {
    this.contactService.acceptOffer();
  }
  addChatToFullScreen(show) {
    this.contactService.addChatToFullScreen(show);
  }
  askForVideoUpgrade() {
    this.contactService.askForUpgrade('Video');
  }
  askForVoiceUpgrade() {
    this.contactService.askForUpgrade('Voice');
  }
  changeLang(lang) {
    this.translateService.use(lang);
  }
  closeApp() {
    this.track('interaction service close app');
    this.contactService.closeApp();
  }
  closeContact(dim?: Dimension) {
    this.track('interaction service close contact');
    this.contactService.closeContact(dim);
  }
  closeUploadPanel() {
    this.contactService.closeUploadPanel();
  }
  dismissCloseModal() {
    this.track('dismiss close modal');
    this.contactService.showCloseModal(false);
  }
  events(): Observable<EventsState> {
    return this.store.pipe(select(getEventsState));
  }
  getState(): Observable<UiState> {
    return this.store.pipe(select(getUiState));
  }
  hangUp(dim: Dimension) {
    this.contactService.hangUp(dim);
  }
  hideChat() {
    this.contactService.hideChat();
  }
  init() {
    const contextReady = this.contextService.ready();
    contextReady.subscribe( (context: ContextState) => {
      if (context.loaded) {
        this.vivocha = this.contextService.getVivocha();
        this.context = context;
        this.registerChangeLangService();
        this.contactService.initializeContact(this.vivocha, this.context);
      }
    });
    return contextReady.pipe(filter(context => context.loaded));
  }
  minimize(minimize: boolean, isFullScreen?: boolean, positionObject?: any, sizeObject?: any) {
    this.contactService.minimize(minimize, isFullScreen, positionObject, sizeObject);
  }
  maximizeWidget(isFullScreen: boolean, dim: Dimension) {
    this.contactService.maximizeWidget(isFullScreen, dim);
  }
  minimizeMedia() {
    this.contactService.minimizeMedia();
  }
  minimizeWidget(dim: Dimension) {
     this.contactService.minimizeWidget(dim);
  }
  muteToggle(muted) {
    this.contactService.muteToggle(muted);
  }
  openAttachment(url, click?: boolean) {
    this.contactService.openAttachment(url, click);
  }
  processQuickReply(reply) {
    this.track('process quick reply');

    this.contactService.processQuickReply(reply);
  }
  private registerChangeLangService() {
    this.vivocha.bus.registerService('vvcApp', {
      changeLang: (lang) => this.changeLang(lang),
      closeContact: (dim?: Dimension) => this.closeContact(dim),
      closeAndRemove: (dim?: Dimension) => {
        this.closeContact(dim);
        this.closeApp();
      }
    });
  }
  registerCustomAction(action): Observable<any> {
    return this.contactService.registerCustomAction(action);
  }
  rejectAgentRequest(requestId) {
    this.contactService.rejectAgentRequest(requestId);
  }
  rejectOffer() {
    this.contactService.rejectOffer();
  }
  sendAttachment(upload) {
    this.contactService.sendAttachment(upload);
  }
  sendIsWriting() {
    this.contactService.sendIsWriting();
  }
  sendPostBack(action) {
    this.track('visitor send post back');
    this.contactService.sendPostBack(action);
  }
  sendRequest(requestId, requestData) {
    this.track('visitor send request');
    return this.contactService.sendRequest(requestId, requestData);
  }
  sendText(text) {
    this.track('visitor send text');
    this.contactService.sendText(text);
  }
  setDimensions(dim) {
    this.contactService.setDimension(dim);
  }
  setFullScreen() {
    this.contactService.setFullScreen();
  }
  setNormalScreen() {
    this.contactService.setNormalScreen();
  }
  setTopBar(avatarUrl: string, title: string, subtitle: string) {
    this.contactService.setTopBar(avatarUrl, title, subtitle);
  }
  setTopBarAvatar(avatarUrl: string) {
    this.contactService.setTopBarAvatar(avatarUrl);
  }
  setTopBarSubtitle(subtitle: string) {
    this.contactService.setTopBarSubtitle(subtitle);
  }
  setTopBarTitle(title: string) {
    this.contactService.setTopBarTitle(title);
  }
  showCloseModal() {
    this.contactService.showCloseModal(true);
  }
  showUploadPanel() {
    this.contactService.showUploadPanel();
  }
  showSurvey() {
    this.contactService.showSurvey();
  }
  submitDataCollection(dc) {
    this.contactService.submitDataCollection(dc);
  }
  submitSurvey(dc) {
    this.contactService.submitSurvey(dc);
  }
  toggleEmojiPanel() {
    this.contactService.toggleEmojiPanel();
  }
  toggleVideo(show) {
    this.contactService.toggleVideo(show);
  }
  track(id: string, obj?: any) {
    this.contactService.track(id, obj);
  }
  updateLeftScrollOffset(o: LeftScrollOffset) {
    this.contactService.updateLeftScrollOffset(o);
  }
  upgradeCbnToChat() {
    this.contactService.upgradeCbnToChat();
  }
}
