<template>
  <div>
    <h3 class="my-3">新規書籍登録</h3>
    <b-row>
      <b-col cols="4">
        <img
          class="d-block mx-auto"
          :src="book.coverUrl"
          v-if="!!book.coverUrl"
        />
      </b-col>

      <b-col cols="8">
        <b-form @submit.prevent>
          <b-form-group label-cols-md="2" content-cols-md="8" label="ISBN">
            <b-input-group>
              <b-form-input
                v-model="book.isbn"
                type="text"
                @keyup.enter="fetchBookInfo"
              >
              </b-form-input
              ><b-input-group-append>
                <b-button variant="info" @click="fetchBookInfo" type="button"
                  >Fetch</b-button
                >
              </b-input-group-append></b-input-group
            >
          </b-form-group>

          <b-form-group label-cols-md="2" content-cols-md="8" label="Title">
            <b-form-input v-model="book.title" type="text"></b-form-input>
          </b-form-group>

          <b-form-group label-cols-md="2" content-cols-md="8" label="SubTitle">
            <b-form-input v-model="book.subtitle" type="text"></b-form-input>
          </b-form-group>

          <b-form-group label-cols-md="2" content-cols-md="8" label="Author">
            <b-form-input v-model="book.author" type="text"></b-form-input>
          </b-form-group>

          <b-form-group label-cols-md="2" content-cols-md="8" label="Publisher">
            <b-form-input v-model="book.publisher" type="text"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            label="Published Date"
          >
            <b-form-input
              v-model="book.publishedDate"
              type="date"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            label="Description"
          >
            <b-form-textarea
              v-model="book.description"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group label-cols-md="2" content-cols-md="8" label="Note">
            <b-form-textarea
              v-model="book.note"
              rows="1"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            label="Cover Image URL"
          >
            <b-form-input v-model="book.coverUrl" type="url"></b-form-input>
          </b-form-group>
        </b-form>

        <b-button
          class="float-right"
          type="submit"
          variant="primary"
          @click="onSubmit"
          >Register</b-button
        >
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { booklist } from "~/plugins/firebase.js";

export default {
  middleware: "authenticated",
  data: function () {
    return {
      book: {
        isbn: "",
        title: "",
        subtitle: "",
        author: "",
        publisher: "",
        publishedDate: "",
        description: "",
        note: "",
        coverUrl: "",
      },
      bookInfoRaw: null,
    };
  },
  methods: {
    fetchBookInfo: async function () {
      const isbn_tmp = this.book.isbn;
      this.resetBookInfo();
      this.book.isbn = isbn_tmp;
      if (this.book.isbn.trim() == "") return;
      this.book.isbn = this.isbnFormat(this.book.isbn);
      try {
        const response = await this.$axios.$get(
          "https://api.openbd.jp/v1/get?isbn=" + this.book.isbn
        );
        this.bookInfoRaw = response[0];

        this.book.title = this.bookInfoRaw.onix.DescriptiveDetail.TitleDetail.TitleElement.TitleText.content;

        try {
          this.book.subtitle = this.bookInfoRaw.onix.DescriptiveDetail.TitleDetail.TitleElement.Subtitle.content;
        } catch (error) {
          this.book.subtitle = "";
          this.makeToast("Warn!", "Subtitle wasn't found.", "warning");
        }

        this.book.author = this.bookInfoRaw.summary.author;

        let date = this.bookInfoRaw.summary.pubdate.replace(/\-/g, "");
        this.book.publishedDate =
          date.length == 8
            ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
            : `${date.slice(0, 4)}-${date.slice(4, 6)}-01`;

        this.book.publisher = this.bookInfoRaw.summary.publisher;

        try {
          this.book.description = this.bookInfoRaw.onix.CollateralDetail.TextContent.map(
            (x) => x.Text
          ).join("\n");
        } catch (error) {
          this.book.description = "";
          this.makeToast(
            "Warn!",
            "Description of the book wasn't found.",
            "warning"
          );
        }

        this.book.coverUrl = this.bookInfoRaw.summary.cover || "";
        if (this.book.coverUrl == "") {
          this.makeToast(
            "Warn!",
            "The URL of Book Cover wasn't found.",
            "warning"
          );
        }
      } catch (error) {
        this.makeToast("Error!", "Couldn't find the book.", "warning");
        console.error(error);
      }
    },
    onSubmit: async function () {
      if (this.book.title == "") {
        this.makeToast("Error!", "Fill in the Title", "danger");
      }
      this.book.isbn = this.isbnFormat(this.book.isbn);
      Object.keys(this.book).map((k) => (this.book[k] = this.book[k].trim()));
      await booklist
        .doc(this.book.isbn)
        .set(this.book)
        .then((ref) => {
          this.makeToast("Success!", "Registered New Book.", "info");
          this.resetBookInfo();
        })
        .catch((error) => {
          this.makeToast("Error!", "Couldn't register the book.", "danger");
          console.error(error);
        });
      await this.$store.dispatch("getBooklistLength");
      await booklist
        .doc("COUNTER")
        .set({ length: this.$store.getters.booklistLength + 1 })
        .then((ref) => {})
        .catch((err) => {});
    },
    isbnFormat: function (isbn) {
      return isbn.trim().replace(/\-/g, "");
    },
    resetBookInfo: function () {
      this.book.isbn = "";
      this.book.title = "";
      this.book.subtitle = "";
      this.book.author = "";
      this.book.publisher = "";
      this.book.publishedDate = "";
      this.book.description = "";
      this.book.note = "";
      this.book.coverUrl = "";
    },
    makeToast: function (title, body, variant = "primary") {
      this.$bvToast.toast(body, {
        title: title,
        autoHideDelay: 3000,
        toaster: "b-toaster-bottom-left",
        variant: variant,
        solid: true,
        appendToast: true,
      });
    },
  },
};
</script>

<style>
</style>