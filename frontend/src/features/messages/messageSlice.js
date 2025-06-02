import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    selectedConversationId: null,
    messages: [],
    messageDraft: '' // 入力中のテキスト
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload
    },
    setMessageDraft: (state, action) => {
      state.messageDraft = action.payload
    },
    clearMessageDraft: (state) => {
      state.messageDraft = ''
    },
    addIncomingMessages: (state, action) => {
      state.messages.push(action.payload)
    }
  }
})
  
export const {
  setActiveConversation,
  setMessageDraft,
  clearMessageDraft,
  addIncomingMessages
} = messageSlice.actions
export const selectSelectedConversationId = (state) => state.message.selectedConversationId
export default messageSlice.reducer
  