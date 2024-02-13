import { useEffect , useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container, CircularProgress, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import './PokemonList.css';

const PokemonTable = () =>  {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fecthPokemons = async ()=> {

      setLoading(true);
      const offset = (currentPage -1 ) * limit;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
      const data = await response.json();
      const dataPromises = data.results.map(async (pokemon) => {
        const repsonse = await fetch(pokemon.url);
        const detailsPokemon = await repsonse.json();
        return {
          id: detailsPokemon.id,
          name: detailsPokemon.name, 
          image: detailsPokemon.sprites.front_default
        }
      })
    const resultPokemons = await Promise.all(dataPromises)
    setPokemons(resultPokemons);
    setLoading(false)
    }

    fecthPokemons();
  }, [currentPage, limit])

  const handlePrev = () => {
   setCurrentPage((prev) => Math.max(prev -1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setCurrentPage(1);
  };

  

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        Pokemon List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {pokemons.map((pokemon) => (
            <Grid item key={pokemon.id} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={pokemon.image}
                  alt={pokemon.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {pokemon.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {pokemon.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <div className="pagination-controls">
        <div className="pagination-buttons">
          <Button variant="contained" onClick={handlePrev} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button variant="contained" style={{ marginLeft: '10px' }} onClick={handleNext}>
            Next
          </Button>
        </div>
        <FormControl className="limit-select-form" variant="outlined" size="small">
          <InputLabel id="select-limit-label">Per Page</InputLabel>
          <Select
            labelId="select-limit-label"
            id="select-limit"
            value={limit}
            onChange={handleLimitChange}
            label="Per Page"
            className="limit-select-control"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Container>
  );
};

export default PokemonTable
