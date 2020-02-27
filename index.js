const csv = require("csv-writer");
const api = require("./api");

const csvWriter = csv.createObjectCsvWriter({
  path: "lingualeoDict.csv",
  header: [
    { id: "word", title: "Word" },
    { id: "transcription", title: "Transcription" },
    { id: "translation", title: "Translation" }
  ]
});

const getWholeDictionary = async () => {
  let next = true;
  let offset = 0;
  let words = [];

  while (next) {
    try {
      let res = await api.getDictionary(offset);
      if (res.body && res.body.words) {
        words.push(...res.body.words);
        next = res.body.next_chunk != null ? res.body.next_chunk : false;
        offset = words.length;
      }
    } catch (e) {
      console.error(e);
      break;
    }
  }
  return words;
};

let credentials = process.argv.slice(2);

if (credentials.length < 2) {
  console.error("There are should be 2 parameters: login & password");
  return;
}

api
  .authorize(credentials[0], credentials[1])
  .then(() => getWholeDictionary())
  .then(words =>
    words.map(word => ({
      word: word.word_value,
      transcription:
        word.transcription.length > 0 ? `[${word.transcription}]` : "-",
      translation: word.translate_value
    }))
  )
  .then(records => {
    csvWriter.writeRecords(records);
  })
  .catch(e => console.error(e));
