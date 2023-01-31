import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (url) => {
	process.on('uncaughtException', function (err) {
		console.log(err);
	});

	const nameLike = url.url.searchParams.get('name-like');

	return await fetch(`http://127.0.0.1:8082/api/cities?name-like=${nameLike}`);
};
