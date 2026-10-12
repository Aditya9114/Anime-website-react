import axios from "axios";

const ENDPOINT = "https://graphql.anilist.co";

async function request(query, variables = {}) {
  const response = await axios.post(ENDPOINT, { query, variables }, { timeout: 15000 });
  if (response.data.errors?.length) {
    throw new Error(response.data.errors.map((error) => error.message).join("; "));
  }
  return response.data.data;
}

const CARD_FIELDS = `
  id idMal
  title { english romaji }
  coverImage { large }
  averageScore
  rankings { rank type context }
  episodes
  status
  genres
  studios(isMain: true) { nodes { id name } }
`;

export async function getTopAnime() {
  const data = await request(`query { Page(page: 1, perPage: 25) { media(type: ANIME, sort: SCORE_DESC, isAdult: false) { ${CARD_FIELDS} } } }`);
  return data.Page.media;
}

export async function getAiringAnime() {
  const data = await request(`query { Page(page: 1, perPage: 10) { media(type: ANIME, status: RELEASING, format: TV, sort: TRENDING_DESC, isAdult: false) { ${CARD_FIELDS} } } }`);
  return data.Page.media;
}

export async function searchAnime(search) {
  const data = await request(
    `query ($search: String!) { Page(page: 1, perPage: 10) { media(type: ANIME, search: $search, sort: SEARCH_MATCH, isAdult: false) { id idMal title { english romaji } } } }`,
    { search },
  );
  return data.Page.media;
}

const DETAIL_FIELDS = `
  id idMal title { english romaji native }
  description(asHtml: false)
  coverImage { extraLarge large }
  trailer { id site thumbnail }
  rankings { rank type context }
  bannerImage averageScore season seasonYear format status episodes
  startDate { year month day } endDate { year month day }
  genres tags { name }
  studios { edges { isMain node { id name } } }
  nextAiringEpisode { episode airingAt timeUntilAiring }
  airingSchedule(notYetAired: true, page: 1, perPage: 1) { nodes { episode airingAt timeUntilAiring } }
  characters(page: 1, perPage: 25, sort: [ROLE, FAVOURITES_DESC]) {
    edges {
      role
      node { id name { full } image { large } }
      voiceActorsJp: voiceActors(language: JAPANESE) { name { full } }
      voiceActorsEn: voiceActors(language: ENGLISH) { name { full } }
      voiceActorsEs: voiceActors(language: SPANISH) { name { full } }
      voiceActorsFr: voiceActors(language: FRENCH) { name { full } }
      voiceActorsIt: voiceActors(language: ITALIAN) { name { full } }
      voiceActorsDe: voiceActors(language: GERMAN) { name { full } }
    }
  }
  recommendations(page: 1, perPage: 10, sort: RATING_DESC) {
    nodes { mediaRecommendation { id idMal title { english romaji } coverImage { large } averageScore } }
  }
  streamingEpisodes { title url site }
`;

export async function getAnimeByMalId(malId) {
  const data = await request(
    `query ($malId: Int!) { Media(idMal: $malId, type: ANIME) { ${DETAIL_FIELDS} } }`,
    { malId: Number(malId) },
  );
  return data.Media;
}

export async function getAllAnimeCharacters(malId) {
  const characters = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const data = await request(
      `query ($malId: Int!, $page: Int!) { Media(idMal: $malId, type: ANIME) { characters(page: $page, perPage: 25, sort: [ROLE, FAVOURITES_DESC]) { edges { role node { id name { full } image { large } } voiceActorsJp: voiceActors(language: JAPANESE) { name { full } } voiceActorsEn: voiceActors(language: ENGLISH) { name { full } } voiceActorsEs: voiceActors(language: SPANISH) { name { full } } voiceActorsFr: voiceActors(language: FRENCH) { name { full } } voiceActorsIt: voiceActors(language: ITALIAN) { name { full } } voiceActorsDe: voiceActors(language: GERMAN) { name { full } } } pageInfo { hasNextPage } } } }`,
      { malId: Number(malId), page },
    );
    if (!data.Media) break;
    characters.push(...data.Media.characters.edges);
    hasNextPage = data.Media.characters.pageInfo.hasNextPage;
    page += 1;
  }
  return characters;
}
