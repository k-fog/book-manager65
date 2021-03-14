import { auth } from "~/plugins/firebase.js"

export default (context) => {
  const { store } = context

  return new Promise((resolve, reject) => {
    auth().onAuthStateChanged(user => {
      if (!user) { store.commit("setUser", null); }
      else {
        const currentUser = {
          displayName: user.displayName,
          email: user.email
        }
        store.commit("setUser", currentUser);
      }
      resolve();
    })
  })
}