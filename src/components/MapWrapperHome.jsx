useEffect(() => {
  const fetchData = async () => {
    try {
      // First check for session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError.message);
        // Continue without user - will show public trips only
      }

      if (session?.user) {
        setCurrentUser(session.user);

        // Fetch user's trips for the map
        const userTrips = await fetchUserTripsWithFootprints();
        setUserTripsForMap(userTrips);
      }

      // Fetch trips with tags, profiles, and footprints for Recent Trips section
      const { data: tripsData, error: tripsError } = await supabase
        .from("trips")
        .select(
          `
          *,
          profiles (
            username
          ),
          trip_tags (
            tags (
              id,
              name,
              slug
            )
          ),
          footprints (
            id,
            title,
            location,
            date,
            latitude,
            longitude,
            cover_photo_url
          )
        `
        )
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(2);

      if (tripsError) {
        console.error("Error fetching trips:", tripsError.message);
        throw tripsError;
      }

      // Process the data
      const processedTrips =
        tripsData?.map((trip) => ({
          ...trip,
          username:
            session?.user?.id === trip.user_id
              ? "You"
              : trip.profiles?.username || `user_${trip.user_id?.slice(-4)}`,
          footprint_count: trip.footprints?.length || 0,
          photo_count:
            trip.footprints?.filter((f) => f.cover_photo_url).length || 0,
          start_date: trip.start_date
            ? new Date(trip.start_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "No date",
          locations:
            trip.footprints?.map((f) => ({
              name: f.title,
              date: new Date(f.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              location: f.location,
              lat: f.latitude,
              lng: f.longitude,
              photo: f.cover_photo_url,
            })) || [],
          tags: trip.trip_tags?.map((tt) => tt.tags) || [],
        })) || [];

      setTrips(processedTrips);
    } catch (error) {
      console.error("Error in fetchData:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time auth state listener
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      setCurrentUser(session.user);
      // Refetch user trips when auth state changes
      fetchUserTripsWithFootprints().then(setUserTripsForMap);
    } else {
      setCurrentUser(null);
      setUserTripsForMap([]);
    }
  });

  fetchData();

  // Cleanup subscription on unmount
  return () => {
    subscription?.unsubscribe();
  };
}, []);
