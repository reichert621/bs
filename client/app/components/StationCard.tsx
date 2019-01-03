import * as React from 'react';
import { capitalize } from 'lodash';
import { Flex, Text, Label, Card, LogoImg } from './common';
import { Station } from '../helpers/locations';

type StationCardProps = {
  station: Station;
};

const formatCompany = (company: string) => {
  switch (company) {
    case 'gobike':
      return 'GoBike';
    default:
      return capitalize(company);
  }
};

// TODO: DRY up? (see VehicleCard.tsx)
const StationCard = ({ station }: StationCardProps) => {
  const { id, name, company, available, miles, color } = station;
  const { bikes, ebikes } = available;
  const formattedCompany = formatCompany(company);
  const formattedDistance = miles ? `${miles.toFixed(2)} mi` : 'N/A';

  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Flex alignItems="center">
          <LogoImg src={`/assets/logos/${company}.jpg`} mr={2} />
          <Text fontSize={[3, 2, 2, 3]} fontWeight={3}>
            {formattedCompany}
          </Text>
        </Flex>
        <Text fontSize={[2, 1, 1, 2]}>
          <Label mr={1}>Distance:</Label> {formattedDistance}
        </Text>
      </Flex>

      <Flex justifyContent="space-between">
        <Text fontSize={[1, 0, 0, 1]}>
          <Label mr={1}>E-bikes:</Label> {ebikes}
        </Text>
        <Text fontSize={[1, 0, 0, 1]}>
          <Label mr={1}>Bikes:</Label> {bikes}
        </Text>
      </Flex>
    </Card>
  );
};

export default StationCard;
