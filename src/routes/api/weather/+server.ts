import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (request) => {
	process.on('uncaughtException', function (err) {
		console.log(err);
	});

	const lat = request.url.searchParams.get('lat');
	const long = request.url.searchParams.get('long');

	if (lat !== null && long !== null) {
		return await fetch(`http://127.0.0.1:8082/${request.url.pathname}${request.url.search}`);
	}

	return new Response();
};
