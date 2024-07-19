import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBookmark, faShareAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Styled components
const InfoContainer = styled.div`
  background-color: #f0f4f8;
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 800px;
  margin: 20px auto;
`;

const IntroSection = styled.section`
  margin-bottom: 40px;
  text-align: center;
`;

const FeaturesSection = styled.section`
  margin-bottom: 40px;
`;

const ContactSection = styled.section`
  margin-bottom: 0;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #3182ce;
  margin-bottom: 15px;
`;

const Paragraph = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 10px;
`;

const IconContainer = styled.span`
  margin-right: 10px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 10px;
`;

const FeatureText = styled.span`
  flex: 1;
`;

const Home = () => {
  const handleIconClick = (feature) => {
    // Handle navigation or actions based on the feature clicked
    switch (feature) {
      case 'map':
        // Handle click on map icon (optional)
        console.log('Navigate to map page');
        break;
      case 'bookmark':
        // Handle click on bookmark icon (optional)
        console.log('Navigate to bookmark page');
        break;
      case 'share':
        // Handle click on share icon (optional)
        console.log('Perform share action');
        break;
      case 'info':
        // Handle click on info icon (optional)
        console.log('Navigate to info page');
        break;
      default:
        break;
    }
  };

  return (
    <InfoContainer>
      <IntroSection>
        <Title>Welcome to BizScout</Title>
        <Paragraph>Discover and explore businesses near you with BizScout. Click on the icons below in the features section to get started!</Paragraph>
      </IntroSection>

      <FeaturesSection>
        <Subtitle>Features</Subtitle>
        <FeatureItem>
          <IconContainer>
            <Link to="/search">
              <FontAwesomeIcon icon={faMapMarkerAlt} onClick={() => handleIconClick('map')} />
            </Link>
          </IconContainer>
          <FeatureText>
            Search for businesses without websites based on location and type.
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <IconContainer>
            <Link to="/bookmarks">
              <FontAwesomeIcon icon={faBookmark} onClick={() => handleIconClick('bookmark')} />
            </Link>
          </IconContainer>
          <FeatureText>
            Bookmark your favorite businesses for quick access.
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <IconContainer>
            <Link to="/search">
              <FontAwesomeIcon icon={faShareAlt} onClick={() => handleIconClick('share')} />
            </Link>
          </IconContainer>
          <FeatureText>
            Share business information with anyone.
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <IconContainer>
            <Link to="/search">
              <FontAwesomeIcon icon={faInfoCircle} onClick={() => handleIconClick('info')} />
            </Link>
          </IconContainer>
          <FeatureText>
            View detailed information about each business.
          </FeatureText>
        </FeatureItem>
      </FeaturesSection>

      <ContactSection>
        <Subtitle>Contact Me</Subtitle>
        <Paragraph>
          Hi, I'm Labib Bhuiyan, the creator of BizScout. I'm passionate about helping freelance web developers discover businesses.
        </Paragraph>
        <Paragraph>
          Feel free to reach out to me at <a href="mailto:banonbhuiya440@gmail.com">banonbhuiya440@gmail.com</a> for any questions or feedback!
        </Paragraph>
      </ContactSection>
    </InfoContainer>
  );
}

export default Home;
