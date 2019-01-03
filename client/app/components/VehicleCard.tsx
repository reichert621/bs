import * as React from 'react';
import { capitalize } from 'lodash';
import { Flex, Text, Label, Card, LogoImg } from './common';
import { Vehicle } from '../helpers/locations';

type VehicleCardProps = {
  vehicle: Vehicle;
};

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const { id, name, company, charge, miles, type, color } = vehicle;
  const formattedCompany = capitalize(company);
  const formattedType = capitalize(type);
  const formattedDistance = miles ? `${miles.toFixed(2)} mi` : 'N/A';

  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Flex alignItems="center">
          <LogoImg src={`/assets/logos/${company}.jpg`} mr={2} />
          <Text fontSize={[3, 2, 2, 3]} fontWeight={3}>
            {formattedCompany} {name || id}
          </Text>
        </Flex>
        <Text fontSize={[2, 1, 1, 2]}>
          <Label mr={1}>Battery:</Label> {charge}%
        </Text>
      </Flex>

      <Flex justifyContent="space-between">
        <Text fontSize={[1, 0, 0, 1]}>
          <Label mr={1}>Type:</Label> {formattedType}
        </Text>
        <Text fontSize={[1, 0, 0, 1]}>
          <Label mr={1}>Distance:</Label> {formattedDistance}
        </Text>
      </Flex>
    </Card>
  );
};

export default VehicleCard;
