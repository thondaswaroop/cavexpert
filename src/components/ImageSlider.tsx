// src/components/ImageSlider.tsx

import React, { useCallback } from 'react';
import { Alert, Button, View, Dimensions, StyleSheet, Linking } from 'react-native';
import { globalStyles } from '../Resources';
import { ImageSlider } from 'react-native-image-slider-banner';
import { loggerService } from '../utils/CommonUtils';

const { width: screenWidth } = Dimensions.get('window');

interface ImageData {
  img: string;
  localImagePath?: string; // Add optional local path
}

interface ImageSlideAreaProps {
  images: ImageData[];
  bannerData: any;
  isOffline: boolean;
}

const ImageSlideArea: React.FC<ImageSlideAreaProps> = ({ images, isOffline, bannerData }) => {

  const displayImages = images.map(image => ({
    img: isOffline && image.localImagePath ? `file://${image.localImagePath}` : image.img,
  }));

  const clickImage = async (images: any, index: any) => {
    const bannerURL = bannerData[index]?.url || '';

    loggerService('bannerURL', clickImage.name, bannerURL);

    if (bannerURL) {
      await Linking.openURL(bannerURL);
    }
  };

  return (
    <View>
      <ImageSlider
        data={displayImages.length > 0 ? displayImages : [{ img: 'https://pmgstechnology.com/projects/theManCave/images/logo.png' }]}
        autoPlay={true}
        timer={4000}
        onClick={(images, index) => clickImage(images, index)}
        preview={false}
        caroselImageStyle={[globalStyles.banners.image, styles.image]}
        closeIconColor="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: screenWidth * 0.95,
    height: screenWidth * 1, // Adjust the height ratio according to your needs
    resizeMode: 'contain', // Can change to 'cover' if you prefer.
  },
});

export default ImageSlideArea;
