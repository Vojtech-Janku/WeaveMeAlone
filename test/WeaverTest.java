package test;
import java.util.List;

import org.junit.Test;
import Tablet;
import Weaver;

public class WeaverTest {

    @Test 
    public static void fourTabletsTest() {
        Weaver weaver = new Weaver(List.of(new Tablet(4),new Tablet(4), new Tablet(4), new Tablet(4)));
    }
}