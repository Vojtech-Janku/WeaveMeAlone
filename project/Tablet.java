package project;

import java.util.ArrayList;
import java.util.List;

public class Tablet {
    public final List<String> threadColors;
    public char orientation;

    public Tablet(List<String> threadColors) {
        this.threadColors = threadColors;
    }

    public int getThreadCount() {
        return threadColors.size();
    }

    public String getColor(Integer action)
    {
        return threadColors.get(action % getThreadCount());
    }

    public List<String> generatePattern( List<Integer> actions )
    {
        List<String> pattern = new ArrayList<>();
        for (Integer action : actions) {
            pattern.add(getColor(action)); // TODO: dont forget to move the tablet
        }
        return pattern;
    }
}