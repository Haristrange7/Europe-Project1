import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Upload, User, Import as Passport } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageUtils } from '@/utils/storage';
import { CandidateProfile } from '@/types';
import { toast } from 'sonner';
import gsap from 'gsap';

export const ProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<CandidateProfile>({
    userId: user?.id || '',
    personal: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      contactNumber: '',
    },
    passport: {
      type: '',
      countryCode: '',
      number: '',
      fullName: '',
      nationality: '',
      dateOfBirth: '',
      placeOfBirth: '',
      sex: 'male',
      dateOfIssue: '',
      dateOfExpiry: '',
      placeOfIssue: '',
      fatherName: '',
      spouseName: '',
      address: '',
    },
    experience: {},
    agreements: {
      workContract: false,
      accommodation: false,
      invitation: false,
    },
    documents: {},
    status: 'incomplete',
  });

  useEffect(() => {
    if (user) {
      const existingProfile = storageUtils.getProfile(user.id);
      if (existingProfile) {
        setProfile(existingProfile);
      }
    }

    // Animate form
    gsap.fromTo('.profile-form', 
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    );
  }, [user, currentStep]);

  const handleInputChange = (section: 'personal' | 'passport', field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(profile.personal.firstName && profile.personal.lastName && 
                  profile.personal.email && profile.personal.contactNumber);
      case 2:
        return !!(profile.passport.type && profile.passport.countryCode && 
                  profile.passport.number && profile.passport.fullName &&
                  profile.passport.nationality && profile.passport.dateOfBirth);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const updatedProfile = {
        ...profile,
        status: profile.passport.number ? 'quiz_pending' as const : 'incomplete' as const,
      };
      
      storageUtils.saveProfile(updatedProfile);
      toast.success('Profile saved successfully!');
      navigate('/candidate/dashboard');
    } catch (error) {
      toast.error('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="profile-form space-y-6">
      <div className="text-center mb-6">
        <User className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-xl font-semibold">Personal Information</h3>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={profile.personal.firstName}
            onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={profile.personal.lastName}
            onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={profile.personal.email}
          onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number *</Label>
        <Input
          id="contactNumber"
          type="tel"
          value={profile.personal.contactNumber}
          onChange={(e) => handleInputChange('personal', 'contactNumber', e.target.value)}
          placeholder="Enter your contact number"
          required
        />
      </div>
    </div>
  );

  const renderPassportInfo = () => (
    <div className="profile-form space-y-6">
      <div className="text-center mb-6">
        <Passport className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-xl font-semibold">Passport Information</h3>
        <p className="text-muted-foreground">Enter your passport details accurately</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="passportType">Passport Type *</Label>
          <Select 
            value={profile.passport.type} 
            onValueChange={(value) => handleInputChange('passport', 'type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select passport type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ordinary">Ordinary</SelectItem>
              <SelectItem value="diplomatic">Diplomatic</SelectItem>
              <SelectItem value="official">Official</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="countryCode">Country Code *</Label>
          <Input
            id="countryCode"
            value={profile.passport.countryCode}
            onChange={(e) => handleInputChange('passport', 'countryCode', e.target.value)}
            placeholder="e.g., IN, US, GB"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="passportNumber">Passport Number *</Label>
        <Input
          id="passportNumber"
          value={profile.passport.number}
          onChange={(e) => handleInputChange('passport', 'number', e.target.value)}
          placeholder="Enter passport number"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name (as per passport) *</Label>
        <Input
          id="fullName"
          value={profile.passport.fullName}
          onChange={(e) => handleInputChange('passport', 'fullName', e.target.value)}
          placeholder="Enter full name as per passport"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality *</Label>
          <Input
            id="nationality"
            value={profile.passport.nationality}
            onChange={(e) => handleInputChange('passport', 'nationality', e.target.value)}
            placeholder="Enter nationality"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sex">Sex *</Label>
          <Select 
            value={profile.passport.sex} 
            onValueChange={(value) => handleInputChange('passport', 'sex', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={profile.passport.dateOfBirth}
          onChange={(e) => handleInputChange('passport', 'dateOfBirth', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeOfBirth">Place of Birth *</Label>
        <Input
          id="placeOfBirth"
          value={profile.passport.placeOfBirth}
          onChange={(e) => handleInputChange('passport', 'placeOfBirth', e.target.value)}
          placeholder="Enter place of birth"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfIssue">Date of Issue</Label>
          <Input
            id="dateOfIssue"
            type="date"
            value={profile.passport.dateOfIssue}
            onChange={(e) => handleInputChange('passport', 'dateOfIssue', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfExpiry">Date of Expiry</Label>
          <Input
            id="dateOfExpiry"
            type="date"
            value={profile.passport.dateOfExpiry}
            onChange={(e) => handleInputChange('passport', 'dateOfExpiry', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeOfIssue">Place of Issue</Label>
        <Input
          id="placeOfIssue"
          value={profile.passport.placeOfIssue}
          onChange={(e) => handleInputChange('passport', 'placeOfIssue', e.target.value)}
          placeholder="Enter place of issue"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fatherName">Father's Name</Label>
          <Input
            id="fatherName"
            value={profile.passport.fatherName}
            onChange={(e) => handleInputChange('passport', 'fatherName', e.target.value)}
            placeholder="Enter father's name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="spouseName">Spouse's Name (if applicable)</Label>
          <Input
            id="spouseName"
            value={profile.passport.spouseName}
            onChange={(e) => handleInputChange('passport', 'spouseName', e.target.value)}
            placeholder="Enter spouse's name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={profile.passport.address}
          onChange={(e) => handleInputChange('passport', 'address', e.target.value)}
          placeholder="Enter your address"
          rows={3}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Document Uploads (Optional)
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="photograph">Passport Photograph</Label>
            <Input
              id="photograph"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleInputChange('passport', 'photograph', file);
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signature">Signature</Label>
            <Input
              id="signature"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleInputChange('passport', 'signature', file);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Profile Setup">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Step {currentStep} of 2</CardTitle>
                <CardDescription>
                  {currentStep === 1 ? 'Personal Information' : 'Passport Details'}
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round((currentStep / 2) * 100)}% Complete
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderPassportInfo()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/candidate/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStep > 1 ? 'Previous' : 'Back to Dashboard'}
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Saving...' : currentStep === 2 ? 'Save Profile' : 'Next'}
                {currentStep < 2 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};