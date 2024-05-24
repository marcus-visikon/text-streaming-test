

async function main() {
  const response = await fetch("http://localhost:2312");
  const decoder = new TextDecoder("utf-8")
  const stream = response.body;

  const reader = stream.getReader();
  const chunks = [];
  
  while (true) {
    const { value, done } = await reader.read();
    const text = decoder.decode(value, {stream: !done });

    if (done) {
      console.log("Stream complete");
      break;
    }
    
    // console.log("Received chunk: ", text, value);
    process.stdout.write(text);
    chunks.push(text);
  }

  console.log("Text chunks: ", chunks.join(""));
}

main();