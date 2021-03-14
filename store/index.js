import { auth, booklist } from "~/plugins/firebase.js"

export const state = () => ({ user: null, booklist: null, booklistLength: 0 })

export const mutations = {
  setUser: function (state, payload) {
    state.user = payload;
  },
  setBooklist: function (state, list) {
    state.booklist = list;
  },
  setBooklistLength: function (state, len) {
    state.booklistLength = len;
  }
}

export const actions = {
  signIn: function ({ commit }, { email, password }) {
    return auth().signInWithEmailAndPassword(email, password);
  },
  signOut: function () {
    return auth().signOut();
  },
  updateBooklist: async function ({ commit }) {
    let b = [];
    await booklist.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        b.push(doc.data());
      })
    });
    commit("setBooklist", b);
  },
  getBooklistLength: async function ({ commit }) {
    await booklist.doc("COUNTER").get().then((ref) => {
      commit("setBooklistLength", ref.data().length);
    });
  }
}

export const getters = {
  user: function (state) {
    return state.user;
  },
  booklist: function (state) {
    return state.booklist;
  },
  isAuthenticated: function (state) {
    return !!state.user;
  },
  booklistLength: function (state) {
    return state.booklistLength;
  }
}