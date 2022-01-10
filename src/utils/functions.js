function validateURL(url) {
  return  /^(ftp|http|https):\/\/[^ "]+$/.test(url)
}
