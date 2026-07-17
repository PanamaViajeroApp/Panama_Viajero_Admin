export async function onRequest(context) {
  const apiService = context.env.API_SERVICE

  if (!apiService) {
    return Response.json(
      {
        ok: false,
        error: 'API service binding is not configured',
      },
      { status: 503 },
    )
  }

  return apiService.fetch(context.request)
}
