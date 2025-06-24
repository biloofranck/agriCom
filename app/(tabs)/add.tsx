import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
// No NativeWind imports if you want to completely avoid it for styling components

export default function AddListingScreen() {
  const [title, setTitle] = useState('Sell chair');
  const [description, setDescription] = useState('I will do your floor');
  const [listingType, setListingType] = useState('Goods'); // 'Goods' or 'Services'
  const [price, setPrice] = useState(100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton}>
            {/* Custom Back Arrow (simple 'V' shape) */}
            <View style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.addListingText}>Add Listing</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.stepText}>Step 1/3 General Information</Text>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="Description"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Listing Type Radio Buttons */}
        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Listing Type</Text>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setListingType('Goods')}
          >
            <View
              style={[
                styles.radioOuterCircle,
                listingType === 'Goods' ? styles.radioOuterCircleActive : styles.radioOuterCircleInactive,
              ]}
            >
              {listingType === 'Goods' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioOptionText}>Goods</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setListingType('Services')}
          >
            <View
              style={[
                styles.radioOuterCircle,
                listingType === 'Services' ? styles.radioOuterCircleActive : styles.radioOuterCircleInactive,
              ]}
            >
              {listingType === 'Services' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioOptionText}>Services</Text>
          </TouchableOpacity>
        </View>

        {/* Price "Slider" (Simulated with basic components) */}
        <View style={styles.priceSliderContainer}>
          <View style={styles.priceSliderHeader}>
            <Text style={styles.inputLabel}>Price</Text>
            <Text style={styles.priceValueText}>${price}/h</Text>
          </View>
          {/* Visual representation of slider track */}
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${(price / 500) * 100}%` }, // Max price assumed to be 500
              ]}
            />
            {/* Slider Thumb (purely visual here) */}
            <View
              style={[
                styles.sliderThumb,
                { left: `${(price / 500) * 100}%` }, // Adjust thumb position
              ]}
            />
          </View>
          {/* Controls to adjust price */}
          <View style={styles.priceControls}>
            <TouchableOpacity onPress={() => setPrice(Math.max(0, price - 10))}>
              <Text style={styles.priceControlBtn}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.priceInput}
              keyboardType="numeric"
              value={String(price)}
              onChangeText={(text) => setPrice(parseInt(text) || 0)}
            />
            <TouchableOpacity onPress={() => setPrice(Math.min(500, price + 10))}>
              <Text style={styles.priceControlBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Step Button */}
        <TouchableOpacity style={styles.nextStepButton}>
          <Text style={styles.nextStepButtonText}>Next Step</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16, // px-4 in Tailwind
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16, // py-4 in Tailwind
  },
  backButton: {
    padding: 8, // p-2 in Tailwind
  },
  backArrow: {
    width: 12, // w-3 in Tailwind
    height: 12, // h-3 in Tailwind
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'black',
    transform: [{ rotate: '-45deg' }],
  },
  addListingText: {
    fontSize: 20, // text-xl in Tailwind
    fontWeight: '600', // font-semibold in Tailwind
  },
  headerPlaceholder: {
    width: 32, // w-8 in Tailwind
  },
  progressContainer: {
    marginBottom: 24, // mb-6 in Tailwind
  },
  stepText: {
    color: '#6B7280', // gray-600 in Tailwind
    fontSize: 14, // text-sm in Tailwind
    marginBottom: 8, // mb-2 in Tailwind
  },
  progressBarBackground: {
    flexDirection: 'row',
    height: 8, // h-2 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
    backgroundColor: '#E5E7EB', // gray-200 in Tailwind
  },
  progressBarFill: {
    width: '33.333%', // w-1/3 in Tailwind
    backgroundColor: '#2DD4BF', // teal-500 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
  },
  inputContainer: {
    marginBottom: 16, // mb-4 in Tailwind
  },
  inputLabel: {
    fontSize: 16, // text-base in Tailwind
    fontWeight: '500', // font-medium in Tailwind
    marginBottom: 8, // mb-2 in Tailwind
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300 in Tailwind
    borderRadius: 8, // rounded-lg in Tailwind
    padding: 12, // p-3 in Tailwind
    fontSize: 16, // text-base in Tailwind
  },
  descriptionInput: {
    height: 96, // h-24 in Tailwind
  },
  radioGroup: {
    marginBottom: 24, // mb-6 in Tailwind
  },
  radioLabel: {
    fontSize: 16, // text-base in Tailwind
    fontWeight: '500', // font-medium in Tailwind
    marginBottom: 12, // mb-3 in Tailwind
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // mb-2 in Tailwind
  },
  radioOuterCircle: {
    width: 20, // w-5 in Tailwind
    height: 20, // h-5 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
    borderWidth: 2,
    marginRight: 8, // mr-2 in Tailwind
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterCircleActive: {
    borderColor: '#2DD4BF', // teal-500 in Tailwind
    backgroundColor: '#2DD4BF', // teal-500 in Tailwind
  },
  radioOuterCircleInactive: {
    borderColor: '#9CA3AF', // gray-400 in Tailwind
  },
  radioInnerCircle: {
    width: 10, // w-2.5 in Tailwind
    height: 10, // h-2.5 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
    backgroundColor: 'white',
  },
  radioOptionText: {
    fontSize: 16, // text-base in Tailwind
  },
  priceSliderContainer: {
    marginBottom: 40, // mb-10 in Tailwind
  },
  priceSliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8, // mb-2 in Tailwind
  },
  priceValueText: {
    fontSize: 18, // text-lg in Tailwind
    fontWeight: '700', // font-bold in Tailwind
    color: '#0D9488', // teal-600 in Tailwind
  },
  sliderTrack: {
    height: 8, // h-2 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
    backgroundColor: '#D1D5DB', // gray-300 in Tailwind
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    height: 8, // h-2 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
    backgroundColor: '#2DD4BF', // teal-500 in Tailwind
    left: 0,
  },
  sliderThumb: {
    position: 'absolute',
    top: -4, // Adjust to center vertically on track
    width: 16, // w-4 in Tailwind
    height: 16, // h-4 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
    backgroundColor: '#2DD4BF', // teal-500 in Tailwind
    // We adjust 'left' in the component's render based on price for precise positioning
    marginLeft: -8, // Half of thumb width to center it
  },
  priceControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16, // mt-4 in Tailwind
    alignItems: 'center',
  },
  priceControlBtn: {
    color: '#0D9488', // teal-600 in Tailwind
    fontSize: 18, // text-lg in Tailwind
    paddingHorizontal: 12, // Some padding for touchable area
    paddingVertical: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300 in Tailwind
    borderRadius: 8, // rounded-lg in Tailwind
    padding: 8, // p-2 in Tailwind
    textAlign: 'center',
    width: 96, // w-24 in Tailwind
  },
  nextStepButton: {
    backgroundColor: '#2DD4BF', // teal-500 in Tailwind
    paddingVertical: 16, // py-4 in Tailwind
    borderRadius: 9999, // rounded-full in Tailwind
    marginBottom: 32, // mb-8 in Tailwind
  },
  nextStepButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18, // text-lg in Tailwind
    fontWeight: '600', // font-semibold in Tailwind
  },
});