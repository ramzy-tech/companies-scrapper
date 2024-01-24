type ClutchCompanyType = {
  name: string;
  rating: string;
  tagline: string;
  reviews: string;
  minProjectSize: string;
  hourlyRate: string;
  employees: string;
  location: string;
  logo: string;
  links: {
    [key: string]: string;
  };
  services: string[];
};

export default ClutchCompanyType;
