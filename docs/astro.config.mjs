// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Panoptes SDK',
			description: 'Enterprise-grade SQL auditing for modern applications',
			logo: {
				src: './src/assets/logo.svg',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/malydev/panoptes-sdk'
				},
			],
			editLink: {
				baseUrl: 'https://github.com/malydev/panoptes-sdk/edit/main/docs/',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'Configuration', slug: 'getting-started/configuration' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'How It Works', slug: 'concepts/how-it-works' },
						{ label: 'Audit Flow', slug: 'concepts/audit-flow' },
						{ label: 'Rules Engine', slug: 'concepts/rules-engine' },
						{ label: 'User Context', slug: 'concepts/user-context' },
						{ label: 'SQL Parsing', slug: 'concepts/sql-parsing' },
					],
				},
				{
					label: 'Database Guides',
					items: [
						{ label: 'PostgreSQL', slug: 'databases/postgresql' },
						{ label: 'MySQL', slug: 'databases/mysql' },
						{ label: 'Microsoft SQL Server', slug: 'databases/mssql' },
						{ label: 'SQLite', slug: 'databases/sqlite' },
						{ label: 'Oracle', slug: 'databases/oracle' },
					],
				},
				{
					label: 'Transports',
					items: [
						{ label: 'Overview', slug: 'transports/overview' },
						{ label: 'Console Transport', slug: 'transports/console' },
						{ label: 'File Transport', slug: 'transports/file' },
						{ label: 'HTTP Transport', slug: 'transports/http' },
						{ label: 'Database Transport', slug: 'transports/database' },
					],
				},
				{
					label: 'Advanced Features',
					items: [
						{ label: 'Auto-Create Tables', slug: 'advanced/auto-create-tables' },
						{ label: 'Before/After Capture', slug: 'advanced/before-after-capture' },
						{ label: 'Enhanced Timestamps', slug: 'advanced/enhanced-timestamps' },
						{ label: 'Performance Tuning', slug: 'advanced/performance' },
						{ label: 'Error Handling', slug: 'advanced/error-handling' },
					],
				},
				{
					label: 'API Reference',
					autogenerate: { directory: 'api' },
				},
				{
					label: 'Examples',
					items: [
						{ label: 'Express Application', slug: 'examples/express' },
						{ label: 'Database Transport', slug: 'examples/database-transport' },
						{ label: 'Multi-tenancy', slug: 'examples/multi-tenancy' },
						{ label: 'Background Jobs', slug: 'examples/background-jobs' },
						{ label: 'Custom Rules', slug: 'examples/custom-rules' },
					],
				},
				{
					label: 'Comparison',
					items: [
						{ label: 'Panoptes vs Triggers', slug: 'comparison/vs-triggers' },
						{ label: 'When to Use Panoptes', slug: 'comparison/when-to-use' },
					],
				},
				{
					label: 'Compliance',
					items: [
						{ label: 'GDPR', slug: 'compliance/gdpr' },
						{ label: 'HIPAA', slug: 'compliance/hipaa' },
						{ label: 'SOX', slug: 'compliance/sox' },
						{ label: 'PCI-DSS', slug: 'compliance/pci-dss' },
					],
				},
				{
					label: 'Contributing',
					items: [
						{ label: 'How to Contribute', slug: 'contributing/guide' },
						{ label: 'Code of Conduct', slug: 'contributing/code-of-conduct' },
					],
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],
});
