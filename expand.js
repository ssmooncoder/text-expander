function getPairs() {
  return new Promise((resolve, reject) => {
    const result = {};
    chrome.storage.local.get(null, (entries) => {
      for (let [k, v] of Object.entries(entries)) {
        Object.assign(result, {[k]: v});
      }
      resolve(result);
    });
  });
}

async function expand() {
  
  let pairs = await getPairs();
  
  let focus = document.activeElement;
  
  let i;
  let j;
  let str;
  let len;
  
  if ((focus.type === 'text') || (focus.type === 'textarea')) {
    i = focus.selectionStart;
    j = focus.selectionEnd;
    str = focus.value
    len = str?.length ?? focus.textLength;
  }
  
  while (i > 0 && (str.charAt(i-1) !== ' ') && (str.charAt(i-1) !== '\n')) {
    i -= 1;
  }
  
  while (j <= len && (str.charAt(j) !== ' ') && (str.charAt(j) !== '\n')) {
    j += 1;
  }
  
  sub = str.slice(i, j);
  
  let replace;
  
  if (sub in pairs) {
    replace = pairs[sub];
  } else {
    return;
  }
  
  focus.setRangeText(replace, i, j);
}
expand()