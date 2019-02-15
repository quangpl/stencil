import * as d from '@declarations';
import { sys } from '@sys';
import { isOutputTargetDist } from './output-utils';


export async function outputCommonJsIndexes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = config.outputTargets.filter(isOutputTargetDist);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate commonjs started`, true);

  const promises = outputTargets.map(outputTarget => {
    return generateCommonJsIndex(config, compilerCtx, outputTarget);
  });

  await Promise.all(promises);

  timespan.finish(`generate commonjs finished`);
}


function generateCommonJsIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const outputText = `// ${config.namespace}: CommonJS Main`;

  return writeCommonJsOutput(compilerCtx, outputTarget, outputText);
}


function writeCommonJsOutput(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, outputText: string) {
  const distIndexCjsPath = sys.path.join(outputTarget.buildDir, 'index.js');

  return compilerCtx.fs.writeFile(distIndexCjsPath, outputText);
}