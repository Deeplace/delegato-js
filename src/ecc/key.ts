function normalizeBrainKey(brainKey: string) {
  brainKey = brainKey.trim();
  if (brainKey === "") {
    throw new Error("empty brain key");
  }
  return brainKey.split(/[\t\n\v\f\r ]+/).join(" ");
}

export { normalizeBrainKey };