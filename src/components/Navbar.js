import { BUILD_TIME } from '../utils/buildInfo';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="build-time" title="Son güncelleme zamanı">
        <small>Güncellenme: {BUILD_TIME}</small>
      </div>
    </nav>
  );
};

export default Navbar;