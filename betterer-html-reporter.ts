// src/html-reporter.ts
import { BettererContext, BettererContextSummary, BettererReporter } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { promises as fs } from 'node:fs';

export const reporter: BettererReporter = createHTMLReporter();

function createHTMLReporter(): BettererReporter {
  return {
    async contextEnd(contextSummary: BettererContextSummary): Promise<void> {
      const htmlContent = renderHTMLTemplate(contextSummary);
      await fs.writeFile('report.html', htmlContent, 'utf8');
    },
    contextError(_: BettererContext, error: BettererError): void {
      console.error('Betterer encountered an error:', error);
    }
  };
}

function renderHTMLTemplate(contextSummary: BettererContextSummary): string {
  const { suites } = contextSummary;
  const totalTests = suites.length;
  const testsImproved = suites.filter(run => run.better).length;
  const testsWorsened = suites.filter(run => run.worse).length;
  const testsSame = totalTests - testsImproved - testsWorsened;

  const details = suites.map(suite => suite.runSummaries).map(runSummary => ({
    name: 'run.',
    status: runSummary ? 'Improved' : runSummary ? 'Worsened' : 'Unchanged',
    issues: 'run.'
  }));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Technical Debt Reduction Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            .summary, .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .improved { color: green; }
            .worsened { color: red; }
            .unchanged { color: gray; }
        </style>
    </head>
    <body>
        <h1>Weekly Technical Debt Reduction Report</h1>
        <div class="summary">
            <h2>Summary</h2>
            <p>Total Tests: ${totalTests}</p>
            <p class="improved">Tests Improved: ${testsImproved}</p>
            <p class="worsened">Tests Worsened: ${testsWorsened}</p>
            <p class="unchanged">Tests Unchanged: ${testsSame}</p>
        </div>
        <div class="details">
            <h2>Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test Name</th>
                        <th>Status</th>
                        <th>Issues</th>
                    </tr>
                </thead>
                <tbody>
                    ${details.map(detail => `
                        <tr>
                            <td>${detail.name}</td>
                            <td class="${detail.status.toLowerCase()}">${detail.status}</td>
                            <td><pre>${JSON.stringify(detail.issues, null, 2)}</pre></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </body>
    </html>
  `;
}
