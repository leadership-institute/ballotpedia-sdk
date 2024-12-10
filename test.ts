import BallotpediaService from './src/index'

async function main() {
  const ballotpediaService = new BallotpediaService({ apiKey: '1234567890' })
  const districts = await ballotpediaService.getDistricts(37.7749, -122.4194)
  console.log(districts)
}

main()
