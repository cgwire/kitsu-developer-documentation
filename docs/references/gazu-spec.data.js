function buildSignature(name, params) {
  if (!params) return `${name}()`;

  const entries = Object.entries(params).filter(([key]) => key !== "client");

  const args = entries.map(([key, param]) => {
    if (param.default !== null && param.default !== undefined) {
      return `${key}=${param.default}`;
    }
    return key;
  });

  return `${name}(${args.join(", ")})`;
}

function removeClientParam(params) {
  if (!params) return {};
  const { client, ...rest } = params;
  return rest;
}

export default {
  async load() {
    const spec = await fetch(
      "https://github.com/cgwire/gazu/releases/download/spec-latest/gazu-specs.json",
    ).then((res) => res.json());

    const cleaned = Object.entries(spec).map(([name, def]) => {
      const inputs = removeClientParam(def.input_params);

      return {
        name,
        signature: buildSignature(name, inputs),
        description: def.description,
        inputs,
        outputs: def.output_params,
      };
    });

    return {
      functions: cleaned,
    };
  },
};
