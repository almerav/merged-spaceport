// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://c249a5c996c19a9a8b2b0135cdf6f5b4@o4508958208360448.ingest.us.sentry.io/4509002373267456',
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of transactions
  profilesSampleRate: 1.0, // Capture 100% of profiles
  debug: false,
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
Sentry.startSpan(
  {
    name: 'My First Transaction',
  },
  () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
  },
);

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exits or stopProfiling is called.
Sentry.profiler.stopProfiler();
