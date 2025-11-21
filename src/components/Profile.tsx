/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ProfileService from "../services/profile.service";
import LinksService from "../services/links.service";
import ConnectionsService from "../services/connections.service";
import type { IUser, IUserLink } from "../types/user.type";
import AuthContext from "../context/AuthContext"; // <-- import
import GalleryService from "../services/gallery.service";
import type { IGalleryFile } from "../types/gallery.type";

const Profile: React.FC = () => {
  const { username } = useParams();
  const { currentUser } = useContext(AuthContext);
  const isOwnProfile = !username || username === currentUser?.username;
  const [galleryItems, setGalleryItems] = useState<IGalleryFile[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [links, setLinks] = useState<IUserLink[]>([]);
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [following, setFollowing] = useState<IUser[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );

  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoadingUser(true);
      try {
        const resp = isOwnProfile
          ? await ProfileService.getMyProfile()
          : await ProfileService.getUserByUsername(username!);
        setUser(resp.data);

        const stats = await ConnectionsService.getFollowerStats(
          resp.data.username
        );
        setFollowerCount(stats.followers);
        setFollowingCount(stats.following);

        if (!isOwnProfile) {
          const status = await ConnectionsService.checkFollowStatus(
            resp.data.username
          );
          setIsFollowing(status.isFollowing);
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Unable to load profile.");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [username, isOwnProfile]);

  //links
  useEffect(() => {
    if (!user) return;

    const loadLinks = async () => {
      try {
        const data = isOwnProfile
          ? await LinksService.getMyLinks()
          : await LinksService.getUserLinks(user.username);

        setLinks(data);
      } catch (err) {
        console.error("Links load error:", err);
      }
    };

    loadLinks();
  }, [user, isOwnProfile]);

  useEffect(() => {
    const loadGallerySnippet = async () => {
      try {
        const data = isOwnProfile
          ? await GalleryService.getMyGalleryFiles()
          : await GalleryService.getUserGallery(user!.username);

        // Take first 4-6 items for the snippet
        setGalleryItems(data.slice(0, 10));
      } catch (err) {
        console.error("Gallery snippet load error:", err);
      }
    };

    if (user) loadGallerySnippet();
  }, [user, isOwnProfile]);
  //follow btn
  const handleFollow = async () => {
    if (!user) return;
    try {
      if (isFollowing) {
        await ConnectionsService.unfollow(user.username);
        setIsFollowing(false);
        setFollowerCount((c) => c - 1);
      } else {
        await ConnectionsService.follow(user.username);
        setIsFollowing(true);
        setFollowerCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const openModal = async (type: "followers" | "following") => {
    if (!user) return;
    setModalType(type);
    setIsModalOpen(true);

    try {
      if (type === "followers") {
        const data = await ConnectionsService.getUsersFollowers(user.username);
        setFollowers(data.map((f: any) => f.FollowerUser));
      } else {
        const data = await ConnectionsService.getUsersFollowing(user.username);
        setFollowing(data.map((f: any) => f.FollowingUser));
      }
    } catch (err) {
      console.error("Error loading connections:", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  if (loadingUser) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Could not load profile.</p>;

  return (
    <div className="profile">
      <div className="profile__all">
        {isOwnProfile && (
          <div className="profile__edit-icon">
            <Link to="/profile/edit">
              <span className="material-symbols-outlined">edit</span>
            </Link>
          </div>
        )}
        <header className="profile__wrapper">
          <div className="profile__wrapper__info">
            <h3 className="profile-name">{user.username}</h3>
            <h4 className="email">{user.email}</h4>
            <p className="profile-title">{user.usertitle ?? "No title"}</p>

            <div className="profile__wrapper__avatar">
              <img
                className="profile__wrapper__avatar-img"
                src={
                  user.profilephoto
                    ? `http://localhost:8080/uploads/${user.profilephoto}`
                    : "../../public/silly-seal.gif"
                }
                alt=""
              />
            </div>

            {/* follow section*/}
            {!isOwnProfile && isFollowing !== null && (
              <>
                <button className="btn-follow" onClick={handleFollow}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </>
            )}
            <span className="profile__wrapper__following">
              <span onClick={() => openModal("followers")}>
                {followerCount} Followers
              </span>

              <span onClick={() => openModal("following")}>
                {followingCount} Following
              </span>
            </span>
            {/* link section*/}
            <div className="profile-links">
              <p>You can also follow me on:</p>
              <div className="link-list">
                {links.map((l) => (
                  <div key={l.id} className="link-item">
                    <a href={l.link} target="_blank" rel="noreferrer">
                      {l.link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* about me section*/}
          <div className="profile__wrapper__info">
            <section className="profile__section">
              <h3 className="section-title">About me</h3>
              <p className="profile__section__about">
                {user.bio ?? "No bio provided"}
              </p>
            </section>
          </div>
        </header>

        {/* Portfolio section*/}
        <section className="profile__section">
          <h3 className="section-title">My Portfolio</h3>
          <Link
            to={`/profile/${user.username}/portfolio`}
            className="portfolio-link"
          >
            View Full Portfolio →
          </Link>
        </section>
        <section className="profile__section">
          <h3 className="section-title">My Gallery</h3>

          {galleryItems.length > 0 ? (
            <div className="gallery__grid">
              {galleryItems.map((f) => (
                <Link
                  key={f.id}
                  to={`/profile/${user!.username}/gallery`}
                  className="gallery__item-container"
                >
                  <img
                    src={`http://localhost:8080${f.path}`}
                    alt={f.caption || ""}
                    className="gallery__item"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p>No gallery items yet.</p>
          )}

          <Link
            to={`/profile/${user!.username}/gallery`}
            className="gallery-snippet__view-all"
          >
            View Full Gallery →
          </Link>
        </section>
        {/* follow section - modal*/}
        {isModalOpen && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{modalType === "followers" ? "Followers" : "Following"}</h3>
              <ul>
                {(modalType === "followers" ? followers : following).map(
                  (u) => (
                    <li key={u.id}>
                      <Link
                        to={`/profile/${u.username}`}
                        className="feed__profile"
                        onClick={closeModal}
                      >
                        <img
                          src={
                            u.profilephoto
                              ? `http://localhost:8080/uploads/${u.profilephoto}`
                              : "/silly-seal.gif"
                          }
                          alt=""
                          className="feed__profile-img"
                        />
                        <span>{u.username}</span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
