import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-md">
        <div className="text-center">
          <Loader2 className="animate-spin text-neon-pink mx-auto mb-4" size={48} />
          <p className="text-white font-medium animate-pulse">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <Loader2 className="animate-spin text-neon-pink" size={32} />
    </div>
  );
};

Loading.propTypes = {
  fullScreen: PropTypes.bool,
};

export default Loading;
