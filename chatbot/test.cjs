const { PromptTemplate } = require("langchain");

const prompt = new PromptTemplate({
  inputVariables: ["product"],
  template: "Viết mô tả hấp dẫn cho sản phẩm {product}",
});

prompt.format({ product: "giày sneaker" }).then(console.log);
