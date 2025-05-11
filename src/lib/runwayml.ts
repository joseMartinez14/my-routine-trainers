import RunwayML from '@runwayml/sdk';

const runawayml = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export default runawayml;
