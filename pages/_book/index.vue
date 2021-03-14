<template>
  <div>
    <div class="text-center">
      <b-button variant="primary" @click="beforePage">before</b-button>
      <b-button variant="primary" @click="nextPage">next</b-button>
    </div>
    <b-card-group>
      <div v-for="(book, key) in booklist" :key="key">
        <b-card
          :title="limitChar(book.title, 30)"
          :sub-title="book.subtitle"
          :img-src="book.coverUrl || noImageUrl"
          class="m-3"
          style="max-width: 15rem"
          @click="
            showBookDetail = true;
            showBookId = key;
          "
          role="button"
        >
          <b-card-text>
            {{ limitChar(book.description, 120) }}
          </b-card-text>
        </b-card>
      </div>
    </b-card-group>

    <b-modal
      v-model="showBookDetail"
      hide-footer
      size="lg"
      header-close-variant="dark"
    >
      <template #modal-title>
        <h4>{{ booklist[showBookId].title }}</h4>
        <h6>{{ booklist[showBookId].subtitle }}</h6></template
      >
      <template #default>
        <div class="text-center">
          <b-img
            style="max-width: 15rem"
            :src="booklist[showBookId].coverUrl || noImageUrl"
          ></b-img>
        </div>
        <p>Author : {{ booklist[showBookId].author }}</p>
        <p>Publisher : {{ booklist[showBookId].publisher }}</p>
        <p>{{ booklist[showBookId].description }}</p>
      </template></b-modal
    >
  </div>
</template>
    </b-modal>
  </div>
</template>

<script>
import { booklist } from "~/plugins/firebase.js";

export default {
  data: function () {
    return {
      booklist: [],
      start: null,
      end: null,
      perPage: 24,
      showBookDetail: false,
      showBookId: 0,
      noImageUrl:
        "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg",
    };
  },
  methods: {
    getFirstPage: async function () {
      let query = booklist.orderBy("title");
      query = query.limit(this.perPage);
      await query.get().then((doc) => {
        if (doc.empty) return;
        this.booklist = doc.docs.map((x) => x.data());
        this.start = doc.docs[0];
        this.end = doc.docs[doc.docs.length - 1];
      });
    },
    nextPage: async function () {
      let query = booklist.orderBy("title");
      query = query.startAfter(this.end).limit(this.perPage);
      await query
        .get()
        .then((doc) => {
          if (doc.empty) return;
          this.booklist = doc.docs.map((x) => x.data());
          this.start = doc.docs[0];
          this.end = doc.docs[doc.docs.length - 1];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    beforePage: async function () {
      let query = booklist.orderBy("title");
      query = query.endBefore(this.start).limit(this.perPage);
      await query
        .get()
        .then((doc) => {
          if (doc.empty) return;
          this.booklist = doc.docs.map((x) => x.data());
          this.start = doc.docs[0];
          this.end = doc.docs[doc.docs.length - 1];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    limitChar(text, lim) {
      if (text.length > lim) {
        return text.substr(0, lim) + "...";
      }
      return text;
    },
  },
  fetch: async function () {
    this.getFirstPage();
  },
};
</script>

<style>
</style>