
import java.util.List;

public class Weaver {
    List<Tablet> tablets;

    

    public Weaver(List<Tablet> tablets) {
        this.tablets = tablets;
    }
    
    public int getTabletNumber() {
        return tablets.size();
    }
}

