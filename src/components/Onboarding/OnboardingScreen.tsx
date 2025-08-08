import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive dimensions
const wp = (percentage: number) => (screenWidth * percentage) / 100;
const hp = (percentage: number) => (screenHeight * percentage) / 100;

// Responsive font sizes
const responsiveFontSize = (size: number) => {
  const scale = screenWidth / 375; // Base width (iPhone X)
  const newSize = size * scale;
  return Math.max(12, Math.min(newSize, size * 1.3)); // Min 12, max 130% of original
};

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
  matchPreference: "anyone" | "men" | "women";
}

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
  isPremium?: boolean;
  onRequestUpgrade?: () => void;
}

const availableInterests = [
  "🎵 Music", "🎬 Movies", "🏃‍♀️ Fitness", "🍳 Cooking", "📚 Reading", "✈️ Travel",
  "🎨 Art", "📸 Photography", "🎮 Gaming", "⚽ Sports", "🌱 Nature", "💻 Tech",
  "👗 Fashion", "🧘‍♀️ Yoga", "☕ Coffee", "🐕 Dogs", "🐱 Cats", "🎭 Theater",
  "🍷 Wine", "🏖️ Beach", "🏔️ Mountains", "🎪 Adventure", "📖 Writing", "🎯 Goals"
];

const steps = [
  { id: 1, title: "What's your name?", subtitle: "This is how others will see you" },
  { id: 2, title: "Add your photos", subtitle: "Show your best self with 2-6 photos" },
  { id: 3, title: "Tell us about yourself", subtitle: "Write something that represents you" },
  { id: 4, title: "What are you into?", subtitle: "Pick your interests to find better matches" },
];

export function OnboardingScreen({ 
  onComplete, 
  initialProfile, 
  isPremium = false, 
  onRequestUpgrade 
}: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState(initialProfile?.username ?? "");
  const [photos, setPhotos] = useState<string[]>(initialProfile?.photos ?? []);
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialProfile?.interests ?? []);
  const [matchPreference, setMatchPreference] = useState<"anyone" | "men" | "women">(
    initialProfile?.matchPreference ?? "anyone"
  );

  const handlePhotoUpload = () => {
    // Mock photo upload - in real app, use ImagePicker
    if (photos.length < 6) {
      const mockPhoto = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg`;
      setPhotos(prev => [...prev, mockPhoto]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 10 ? [...prev, interest] : prev
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return username.trim().length >= 2;
      case 2: return photos.length >= 2;
      case 3: return bio.trim().length >= 20;
      case 4: return selectedInterests.length >= 3;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    onComplete({
      username: username.trim(),
      photos,
      bio: bio.trim(),
      interests: selectedInterests,
      matchPreference,
    });
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep - 1];
    
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>✨</Text>
            </View>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your first name"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                maxLength={20}
                textAlign="center"
              />
              <Text style={styles.characterCount}>
                {username.length}/20 characters
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>📷</Text>
            </View>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>

            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.mainPhotoLabel}>
                      <Text style={styles.mainPhotoText}>Main</Text>
                    </View>
                  )}
                </View>
              ))}
              
              {photos.length < 6 && (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handlePhotoUpload}
                >
                  <Text style={styles.addPhotoIcon}>+</Text>
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.photoCount}>
              {photos.length}/6 photos • Minimum 2 required
            </Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>❤️</Text>
            </View>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>

            <View style={styles.bioContainer}>
              <TextInput
                style={styles.bioInput}
                placeholder="I love exploring new places, trying different cuisines, and having deep conversations over coffee. Looking for someone who shares my passion for adventure and can make me laugh..."
                placeholderTextColor="#999"
                value={bio}
                onChangeText={setBio}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
              <View style={styles.bioFooter}>
                <Text style={styles.characterCount}>
                  {bio.length}/500 characters
                </Text>
                <Text style={styles.characterCount}>
                  Minimum 20 characters
                </Text>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>⭐</Text>
            </View>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>

            <View style={styles.interestsContainer}>
              {availableInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) && styles.interestChipSelected
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.interestTextSelected
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.interestCount}>
              {selectedInterests.length}/10 selected • Minimum 3 required
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E91E63" />
      
      <LinearGradient
        colors={['#E91E63', '#FF5722']}
        style={styles.gradient}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step {currentStep} of 4</Text>
            <Text style={styles.progressText}>{Math.round((currentStep / 4) * 100)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(currentStep / 4) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {renderStepContent()}
          </View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !canProceed() && styles.disabledButton
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep === 4 ? "Complete Profile" : "Continue"}
            </Text>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
          
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E91E63',
  },
  gradient: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: responsiveFontSize(12),
    fontFamily: 'Poppins',
  },
  progressBar: {
    height: hp(0.5),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: hp(0.25),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: hp(0.25),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: wp(6),
    padding: wp(6),
    minHeight: hp(60),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  iconText: {
    fontSize: responsiveFontSize(24),
  },
  stepTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: hp(1),
    fontFamily: 'Poppins',
  },
  stepSubtitle: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(3),
    fontFamily: 'Poppins',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    height: hp(6),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    fontSize: responsiveFontSize(16),
    textAlign: 'center',
    fontFamily: 'Poppins',
    marginBottom: hp(1),
  },
  characterCount: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    fontFamily: 'Poppins',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp(2),
  },
  photoContainer: {
    width: wp(40),
    height: hp(20),
    marginBottom: hp(2),
    borderRadius: wp(3),
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: wp(1),
    right: wp(1),
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  mainPhotoLabel: {
    position: 'absolute',
    bottom: wp(1),
    left: wp(1),
    backgroundColor: '#E91E63',
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    borderRadius: wp(2),
  },
  mainPhotoText: {
    color: 'white',
    fontSize: responsiveFontSize(10),
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  addPhotoButton: {
    width: wp(40),
    height: hp(20),
    borderWidth: 2,
    borderColor: '#E91E63',
    borderStyle: 'dashed',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
  },
  addPhotoIcon: {
    fontSize: responsiveFontSize(24),
    color: '#E91E63',
    marginBottom: hp(0.5),
  },
  addPhotoText: {
    fontSize: responsiveFontSize(12),
    color: '#E91E63',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  photoCount: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  bioContainer: {
    width: '100%',
  },
  bioInput: {
    width: '100%',
    height: hp(15),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(3),
    padding: wp(3),
    fontSize: responsiveFontSize(14),
    fontFamily: 'Poppins',
    marginBottom: hp(1),
  },
  bioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: hp(2),
  },
  interestChip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#ddd',
    margin: wp(1),
    backgroundColor: 'white',
  },
  interestChipSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  interestText: {
    fontSize: responsiveFontSize(12),
    color: '#333',
    fontFamily: 'Poppins',
  },
  interestTextSelected: {
    color: 'white',
  },
  interestCount: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  navigationContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
    paddingTop: hp(1),
  },
  primaryButton: {
    backgroundColor: 'white',
    height: hp(6),
    borderRadius: wp(3),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  primaryButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#E91E63',
    fontFamily: 'Poppins',
    marginRight: wp(2),
  },
  arrowText: {
    fontSize: responsiveFontSize(16),
    color: '#E91E63',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: hp(5),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: responsiveFontSize(14),
    color: 'white',
    fontFamily: 'Poppins',
  },
});