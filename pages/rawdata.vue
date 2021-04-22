<template>
  <div>{{ booklistraw }}</div>
</template>

<script>
import { booklist } from "~/plugins/firebase.js";

export default {
  asyncData: async function () {
    let booklistraw = [];
    await booklist.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        booklistraw.push(doc.data());
      });
    });
    return { booklistraw: booklistraw };
  },
};
</script>

<style>
html {
  font-family: "Noto Sans JP", sans-serif;
}
</style>