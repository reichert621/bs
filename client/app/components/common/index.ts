import styled from 'styled-components';
import {
  space,
  color,
  fontSize,
  width,
  borders,
  flex,
  flexDirection,
  justifyContent,
  alignItems,
  fontWeight,
  lineHeight
} from 'styled-system';

export const Box = styled.div`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${borders}
  ${flex}
`;

export const Flex = styled(Box)`
  display: flex;
  ${flexDirection}
  ${alignItems}
  ${justifyContent}
`;

export const Text = styled(Box)`
  ${fontWeight}
  ${lineHeight}
`;

export const Label = styled(Text)`
  display: inline-block;
  font-weight: 400;
  letter-spacing: 0.4px;
`;

export const LogoImg = styled.img`
  ${space}
  height: 24px;
  width: 24px;
  border-radius: 4px;
`;

export const Card = styled(Box)`
  padding: 16px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #fafafa;
  border-radius: 4px;
  box-shadow: 1px 2px 8px 0px rgba(210, 210, 210, 0.4);
`;
