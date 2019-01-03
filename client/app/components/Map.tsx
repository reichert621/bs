import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { LatLngExpression, Icon } from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { first } from 'lodash';
import 'leaflet/dist/leaflet.css';
import {
  Location,
  IconSize,
  IconColor,
  IconOptions,
  getDefaultLocation,
  fetchVehicleLocations,
  findClosestByCompany,
  calculateMidpoint
} from '../helpers/locations';
import VehicleCard from './VehicleCard';
import StationCard from './StationCard';
import { Box, Flex } from './common';

type MapProps = RouteComponentProps<{}> & {};

type MapState = {
  center?: Location;
  locations: Location[];
  locationsById?: { [id: string]: Location };
  locationIds?: string[];
  suggestedIds?: string[];
  hovered?: string;
  selected?: string;
};

class ScooterMap extends React.Component<MapProps, MapState> {
  constructor(props: MapProps) {
    super(props);

    const query = props.location.search;
    const center = getDefaultLocation(query);

    this.state = {
      center,
      locations: [],
      locationsById: {},
      locationIds: [],
      suggestedIds: [],
      hovered: null,
      selected: null
    };
  }

  componentDidMount() {
    const { center } = this.state;
    const { lat, lng } = center;

    return fetchVehicleLocations({ lat, lng })
      .then(({ locations = [] }) => {
        const suggestions = findClosestByCompany(locations);
        const selected = this.getTopChoice(suggestions);
        const formattedLocations = this.formatLocations(locations);

        this.setState({
          selected,
          locationIds: formattedLocations.map(l => String(l.id)),
          suggestedIds: suggestions.map(l => String(l.id)),
          locationsById: formattedLocations.reduce((acc, l) => {
            return { ...acc, [l.id]: l };
          }, {})
        });
      })
      .catch(err => console.log('Error!', err));
  }

  formatLocations(locations: Location[]) {
    return locations.map(item => {
      const { company, isNearby } = item;

      return {
        ...item,
        color: this.getCompanyColor(company),
        size: isNearby ? IconSize.LG : IconSize.MD
      };
    });
  }

  getTopChoice(suggestions: Location[]) {
    const gold = suggestions.filter(l => l.miles < 0.2 && l.rank < 3);
    const silver = suggestions.filter(l => l.miles < 0.25 && l.rank < 4);
    const bronze = suggestions.filter(l => l.rank < 4);
    const top =
      first(gold) || first(silver) || first(bronze) || first(suggestions);

    return top.id;
  }

  getCompanyColor(company: string): IconColor {
    switch (company) {
      case 'scoot':
        return IconColor.RED;
      case 'gobike':
      case 'skip':
        return IconColor.BLUE;
      case 'jump':
        return IconColor.BLACK;
      default:
        return IconColor.GRAY;
    }
  }

  getIcon(options = {} as IconOptions) {
    // TODO: get better icons for bikes/scooters?
    const {
      color = IconColor.BLACK,
      size = IconSize.MD,
      type = 'bike'
    } = options;
    const url = `/assets/${color}-${type}.svg`;

    return new Icon({
      iconUrl: url,
      iconSize: size === IconSize.LG ? [32, 32] : [24, 24],
      iconAnchor: size === IconSize.LG ? [16, 32] : [12, 24]
    });
  }

  getZoom() {
    // TODO: if no scooters are nearby, return 16, 15, etc?
    return 16;
  }

  getMapCenter(): LatLngExpression {
    // TODO: update center based on selected vehicle?
    const { center, selected, locationsById } = this.state;
    const { lat, lng } = center;
    const location = locationsById[selected];

    if (lat && lng) {
      if (location && location.lat && location.lng) {
        const midpoint = calculateMidpoint(center, location);

        return [midpoint.lat, midpoint.lng];
      } else {
        return [lat, lng];
      }
    } else {
      // Default to Mission Dolores neighborhood
      return [37.767043, -122.426436];
    }
  }

  getAllLocations() {
    const { locationsById, locationIds = [] } = this.state;

    return locationIds
      .map(id => locationsById[id])
      .sort((a, b) => {
        const m1 = a.miles * 100;
        const m2 = b.miles * 100;

        if (m1 === m2) {
          return a.charge - b.charge;
        } else {
          return m1 - m2;
        }
      })
      .slice(0, 1000); // just get the 1000 closest locations for now
  }

  getSuggestedLocations() {
    const { locationsById, suggestedIds = [] } = this.state;

    return suggestedIds.map(id => locationsById[id]);
  }

  renderLocationCard(location: Location) {
    switch (location.class) {
      case 'station':
        return <StationCard station={location} />;
      case 'vehicle':
        return <VehicleCard vehicle={location} />;
      default:
        return null;
    }
  }

  renderSuggestedLocation(location: Location) {
    const { id } = location;

    return (
      <Box
        key={id}
        onMouseEnter={() => this.setState({ hovered: String(id) })}
        onMouseLeave={() => this.setState({ hovered: null })}
        pb={2}
      >
        {this.renderLocationCard(location)}
      </Box>
    );
  }

  renderSelectedVehicle(id: string) {
    const { locationsById } = this.state;
    const location = locationsById[id];

    return (
      <Box pb={3} mb={3} borderBottom="1px solid #D8D8D8">
        {this.renderLocationCard(location)}
      </Box>
    );
  }

  render() {
    const { selected, hovered } = this.state;
    const locations = this.getAllLocations();
    const suggestions = this.getSuggestedLocations();
    const zoom = this.getZoom();
    const url = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png';
    const attribution = `<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>`;
    const center = this.getMapCenter();

    return (
      <Flex
        px={[2, 3, 4]}
        justifyContent="space-between"
        flexDirection={['column', 'row']}
      >
        <Box flex={[1, 1, 2]} py={[2, 3, 4]}>
          <Map center={center} zoom={zoom}>
            <TileLayer attribution={attribution} url={url} />

            {/* NB: current location marker */}
            <Marker
              icon={
                new Icon({
                  iconUrl: '/assets/black-pin.svg',
                  iconSize: [40, 40],
                  iconAnchor: [20, 40]
                })
              }
              position={center}
              opacity={0.6}
              onClick={(e: any) => console.log('Center clicked!', e)}
            />

            {locations.map((location, key) => {
              const { id, lat, lng, color, type, size } = location;
              const hasSelected = !!selected;
              const hasHovered = !!hovered;
              const isSelected = selected === id;
              const isHovered = hovered === id;
              const icon = this.getIcon({ color, type, size });

              let opacity = 0.8;

              if (hasSelected || hasHovered) {
                opacity = isSelected || isHovered ? 1.0 : 0.4;
              } else {
                opacity = size === IconSize.LG ? 1.0 : 0.8;
              }

              return (
                <Marker
                  key={key}
                  id={id}
                  icon={icon}
                  position={[lat, lng]}
                  opacity={opacity}
                  onClick={(e: any) =>
                    this.setState({ selected: e.target.options.id })
                  }
                />
              );
            })}
          </Map>
        </Box>

        <Box flex={1} pl={[0, 3]} py={[2, 3, 4]}>
          {selected && this.renderSelectedVehicle(selected)}

          {suggestions.map(location => {
            return this.renderSuggestedLocation(location);
          })}
        </Box>
      </Flex>
    );
  }
}

export default ScooterMap;
