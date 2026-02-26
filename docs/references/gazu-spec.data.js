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

function getModuleFromName(name) {
  const parts = name.split(".");

  // gazu.module.function → module
  if (parts.length === 3) {
    return parts[1];
  }

  // gazu.function → gazu root category
  return "gazu";
}

export default {
  async load() {
    const spec = await fetch(
      "https://github.com/cgwire/gazu/releases/download/spec-latest/gazu-specs.json",
    ).then((res) => res.json());

    const grouped = {};

    Object.entries(spec).forEach(([name, def]) => {
      const module = getModuleFromName(name);
      const inputs = removeClientParam(def.input_params);

      const fn = {
        name,
        signature: buildSignature(name, inputs),
        description: def.description,
        inputs,
        outputs: def.output_params,
      };

      if (!grouped[module]) {
        grouped[module] = [];
      }

      grouped[module].push(fn);
    });

    return {
      modules: grouped,
    };
  },
};
