import {VvcWidgetState, VvcMessage} from './core.interfaces';
const initialWidgetState: VvcWidgetState = {
    chat: false,
    error: false,
    fullScreen: false,
    lastError: '',
    loading: true,
    mute: false,
    mobile: false,
    sharing: false,
    topBarExpanded: true,
    video: false,
    voice: false
};
const extractStateFromMedia = (payload) => {
  const newState: { chat?: boolean, voice?: boolean, video?: boolean, video_rx?: boolean, video_tx?: boolean, sharing?: boolean} = {
      chat: false,
      voice: false,
      video: false,
      video_rx: undefined,
      video_tx: undefined,
      sharing: false
  };
  if (payload.Chat && payload.Chat['tx'] && payload.Chat['rx']) {
    newState.chat = true;
  }
  if (payload.Sharing && payload.Sharing['tx'] && payload.Sharing['rx']) {
    newState.sharing = true;
  }
  if (payload.Voice && payload.Voice['tx'] && payload.Voice['rx']) {
      if (payload.Voice['data']
      && payload.Voice['data']['tx_stream']
      && payload.Voice['data']['rx_stream']) {
          newState.voice = true;
      }
  }
  if (payload.Video && (payload.Video['tx'] || payload.Video['rx'])) {
    if (payload.Video['data'] && payload.Video['data']['rx_stream']) {
        newState.video_rx = payload.Video['data']['rx_stream'];
        newState.video = true;
    }
    if (payload.Video['data'] && payload.Video['data']['tx_stream']) {
        newState.video_tx = payload.Video['data']['tx_stream'];
        newState.video = true;
    }
  }
  console.log('EXTRACTSTATE', JSON.stringify(newState));
  return newState;
};
export const widgetState = (state: VvcWidgetState  = initialWidgetState, {type, payload}) => {
    switch (type) {
        case 'INITIAL_OFFER':
        case 'MEDIA_CHANGE':
            const newState = extractStateFromMedia(payload);
            console.log('MEDIACHANGE-DISPATCHED', newState, payload);
            return Object.assign({}, state, newState);
        case 'JOINED':
            if (payload) {
                return Object.assign({}, state, { agent: payload, loading: false });
            }
            return Object.assign({}, state, { loading: false });
        case 'FULLSCREEN':
            return Object.assign({}, state, { fullScreen: payload });
        case 'REDUCE_TOPBAR':
            return Object.assign({}, state, { topBarExpanded: false });
        case 'SHOW_DATA_COLLECTION':
            return Object.assign({}, state, { dataCollectionPanel: payload });
        case 'AGENT_IS_WRITING':
            return Object.assign({}, state, { isAgentWriting: payload });
        default: return state;
    }
};
export const messages = (messageArray: Array<VvcMessage> = [], {type, payload}) => {
    switch (type) {
        case 'UPDATE_MESSAGE':
            const newArray = [];
            const iMessages = messageArray.filter( m => m.id === payload.id);
            iMessages[0].state = payload.state;
            messageArray.forEach( (m, i) => {
                if (i === iMessages[0].oPos) {
                    newArray.push(iMessages[0]);
                }
                if (m.id !== payload.id) {
                    newArray.push(m);
                }
            });
            return newArray;
        case 'NEW_MESSAGE':
            const isWritingMessages = messageArray.filter( m => m.state === 'iswriting');
            const incomingMessages = messageArray.filter( m => m.type === 'incoming-request' && m.state !== 'closed');
            let chatMessages = [];
            if (incomingMessages.length > 0) {
                chatMessages = messageArray.filter(m => m.state !== 'open').concat(incomingMessages);
            } else {
                chatMessages = messageArray;
            }
            if (payload.type === 'incoming-request') {
                payload.oPos = chatMessages.length;
            }
            return chatMessages
                        .filter (m => m.state !== 'iswriting')
                        .concat(payload, isWritingMessages);
        case 'REM_MESSAGE':
            return messageArray.filter( m => m.id !== payload.id);
        case 'REM_IS_WRITING':
            return messageArray.filter( m => m.state !== 'iswriting');
        default: return messageArray;
    }
};
