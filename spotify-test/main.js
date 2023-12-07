document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const queryInput = document.getElementById('queryInput');
  const resultsContainer = document.getElementById('results');

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const query = queryInput.value.trim();

    if (!query) {
      alert('Inserisci una query di ricerca.');
      return;
    }

    try {
      const results = await cercaCanzone(query);
      mostraRisultati(results);
    } catch (error) {
      console.error(error);
      alert('Errore durante la ricerca della canzone.');
    }
  });

  async function cercaCanzone(query) {
    const clientId = 'TuoClientID';
    const clientSecret = 'TuoClientSecret';
    const token = await ottieniToken(clientId, clientSecret);

    const searchUrl = 'https://api.spotify.com/v1/search';
    const response = await axios.get(searchUrl, {
      params: {
        q: query,
        type: 'track',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.tracks.items.map((track) => ({
      title: track.name,
      artist: track.artists[0].name,
    }));
  }

  async function ottieniToken(clientId, clientSecret) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'b05083805dbc4805bdea75760752cda5',
        client_secret: '0ff2935bcf51459193fee336d51ccda2',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  }

  function mostraRisultati(results) {
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>Nessun risultato trovato.</p>';
      return;
    }

    const ul = document.createElement('ul');
    results.forEach((result) => {
      const li = document.createElement('li');
      li.textContent = `${result.title} - ${result.artist}`;
      ul.appendChild(li);
    });

    resultsContainer.appendChild(ul);
  }
});