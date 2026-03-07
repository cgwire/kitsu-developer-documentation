function cleanSignature(name, raw) {
  let sig = raw;
  // Remove return type annotation
  sig = sig.replace(/\)\s*->.*$/, ")");
  // Remove client parameter (with or without default)
  sig = sig.replace(/,?\s*client:\s*'[^']*'\s*=\s*<[^>]*>/, "");
  sig = sig.replace(/,?\s*client\s*=\s*<[^>]*>/, "");
  sig = sig.replace(/,?\s*client\s*=\s*None/, "");
  sig = sig.replace(/\(\s*,/, "(");
  // Replace args/kwargs with *args/**kwargs (only when not already prefixed)
  sig = sig.replace(/(?<!\*)\bkwargs\b/g, "**kwargs");
  sig = sig.replace(/(?<!\*)\bargs\b/g, "*args");
  // Remove type annotations from parameters
  sig = sig.replace(/:\s*'[^']*'/g, "");
  // Replace object defaults with None
  sig = sig.replace(/<[^>]*>/g, "None");
  // Clean up extra spaces
  sig = sig.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");
  return name + sig;
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
        signature: cleanSignature(name, def.signature),
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
