package project;

import java.util.List;
import java.util.Map;


public class Weaver {
    public List<Tablet> tablets;
    public Map<String, Integer> thread_colors;

    public Weaver(){}

    public Weaver(List<Tablet> tablets) 
    {
        this.tablets = tablets;
    }
    
    public int getTabletNumber() 
    {
        return tablets.size();
    }

    public void getWarpDesign()
    {

    }

    public void getSteps()
    {
        
    }
}

