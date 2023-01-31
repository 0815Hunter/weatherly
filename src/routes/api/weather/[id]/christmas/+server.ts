import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (request) => {
	process.on('uncaughtException', function (err) {
		console.log(err);
	});

	return await fetch(`http://127.0.0.1:8082/${request.url.pathname}`);
};
